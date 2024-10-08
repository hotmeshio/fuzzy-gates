import { MeshData, Types } from '@hotmeshio/hotmesh';
import * as Redis from 'redis';

import { arrayToHash } from '../../modules/utils';
import { DBConfig } from '../../types/manifest';

abstract class BaseEntity {
  meshData: MeshData;
  connected: boolean = false;
  namespace: string;
  namespaceType: string;

  constructor(namespace: string, namespaceType: string, config: DBConfig) {
    this.namespace = namespace;         //'s'
    this.namespaceType = namespaceType; //'fuzzy' //friendly name in case namespace is abbreviated like 's'
    this.meshData = this.initializeMeshData(config);
  }

  protected abstract getEntity(): string;
  abstract getSearchOptions(): Types.WorkflowSearchOptions;
  protected abstract getTaskQueue(): string;

  private initializeMeshData(db_config: DBConfig): MeshData {
    return new MeshData(
      Redis,
      this.getRedisUrl(db_config),
      this.getSearchOptions()
    );
  }

  protected async defaultTargetFn(): Promise<string> {
    return 'OK';
  }

  getNamespace() {
    return this.namespace;
  }

  getRedisUrl = (config: DBConfig) => {
    return { url: `redis${config.REDIS_USE_TLS ? 's' : ''}://${config.REDIS_USERNAME ?? ''}:${config.REDIS_PASSWORD}@${config.REDIS_HOST}:${config.REDIS_PORT}` };
  }

  //******************* ON-CONTAINER-STARTUP COMMANDS ********************

  async init(search = true) {
    await this.connect();
    //if the FT.SEARCH module is enabled
    if (search) {
      await this.index();
    }
  }

  async connect() {
    this.connected = await this.meshData.connect({
      entity: this.getEntity(),
      target: this.defaultTargetFn,
      options: {
        namespace: this.getNamespace(),
        taskQueue: this.getTaskQueue(),
      },
    });
  }

  /**
   * Create the search index
   */
  async index() {
    await this.meshData.createSearchIndex(this.getEntity(), { namespace: this.getNamespace() }, this.getSearchOptions());
  }

  //******************* ON-CONTAINER-SHUTDOWN COMMANDS ********************

  async shutdown() {
    await MeshData.shutdown();
  }

  getIndexName() {
    return this.getSearchOptions().index;
  }

  /**
    * Retrieve entity by id
    * @param id
    * @returns
    * @throws
    */
  async retrieve(id: string, sparse = false) {
    const opts = this.getSearchOptions();
    const fields = sparse ? ['id'] : Object.keys(opts?.schema || {});

    const result = await this.meshData.get(this.getEntity(), id, { fields, namespace: this.getNamespace() });
    if (!result?.id) throw new Error(`${this.getEntity()} not found`);
    return result;
  }

  /**
   * Update entity
   */
  async update(id: string, body: Record<string, any>) {
    await this.retrieve(id);
    await this.meshData.set(
      this.getEntity(),
      id,
      {
        search: { data: body },
        namespace: this.getNamespace(),
      }
    );
    return await this.retrieve(id);
  }

  /**
   * Delete entity
   */
  async delete(id: string) {
    await this.retrieve(id);
    await this.meshData.flush(this.getEntity(), id, this.getNamespace());
    return true;
  }

  /**
   * Find matching entities
   */
  async find(query: { field: string, is: '=' | '[]' | '>=' | '<=', value: string }[] = [], start = 0, size = 100): Promise<{ count: number; query: string; data: Types.StringStringType[]; }> {
    const opts = this.getSearchOptions();
    const response = await this.meshData.findWhere(
      this.getEntity(),
      {
        query,
        return: Object.keys(opts?.schema || {}),
        limit: { start, size },
        options: { namespace: this.getNamespace() },
      },
    ) as { count: number; query: string; data: Types.StringStringType[]; };
    return response;
  }

  /**
   * Count matching entities
   */
  async count(query: { field: string, is: '=' | '[]' | '>=' | '<=', value: string }[]): Promise<number> {
    return await this.meshData.findWhere(
      this.getEntity(),
      {
        query,
        count: true,
        options: { namespace: this.getNamespace() },
      }) as number;
  }

  /**
   * Aggregate matching entities
   */
  async aggregate(filter: { field: string, is: '=' | '[]' | '>=' | '<=', value: string }[] = [], apply: { expression: string, as: string }[] = [], rows: string[] = [], columns: string[] = [], reduce: { operation: string, as: string }[] = [], sort: { field: string, order: 'ASC' | 'DESC' }[] = [], start = 0, size = 100): Promise<any> {
    let command = ['FT.AGGREGATE', this.getIndexName() || 'default'];

    if (filter.length == 0) {
      command.push('*')
    } else {
      const opts = this.getSearchOptions();
      filter.forEach((q: any) => {
        const type: 'TAG' | 'NUMERIC' | 'TEXT' = opts?.schema?.[q.field]?.type ?? 'TEXT';
        switch (type) {
          case 'TAG':
            command.push(`@_${q.field}:{${q.value}}`);
            break;
          case 'TEXT':
            command.push(`@_${q.field}:${q.value}`);
            break;
          case 'NUMERIC':
            command.push(`@_${q.field}:[${q.start} ${q.end}]`);
            break;
        }
      });
    }

    apply.forEach((a: any) => {
      command.push('APPLY', a.expression, 'AS', a.as);
    });

    const groupBy = rows.concat(columns);

    if (groupBy.length > 0) {
      const opts = this.getSearchOptions();
      command.push('GROUPBY', `${groupBy.length}`);
      groupBy.forEach((g: any) => {
        if (opts?.schema?.[g]) {
          command.push(`@_${g}`);
        } else {
          command.push(`@${g}`);
        }
      });
    }

    const opts = this.getSearchOptions();
    reduce.forEach((r: any) => {
      const op = r.operation.toUpperCase();
      if (op == 'COUNT') {
        command.push('REDUCE', op, '0', 'AS', r.as ?? 'count');
      } else if (['COUNT_DISTINCT', 'COUNT_DISTINCTISH', 'SUM', 'AVG', 'MIN', 'MAX', 'STDDEV', 'TOLIST'].includes(op)) {
        const property = opts?.schema?.[r.property] ? `@_${r.property}` : `@${r.property}`;
        command.push('REDUCE', op, '1', property, 'AS', r.as ?? `${r.operation}_${r.property}`);
      }
    });

    if (sort.length > 0) {
      command.push('SORTBY', `${2 * sort.length}`);
      sort.forEach((s: any) => {
        const field = opts?.schema?.[s.field] ? `@_${s.field}` : `@${s.field}`;
        command.push(field, s.order.toUpperCase() || 'DESC');
      });
    }

    try {
      const results = await this.meshData.find(
        this.getEntity(),
        { 
          index: this.getIndexName(),
          namespace: this.getNamespace(),
          taskQueue: this.getTaskQueue(),
          search: this.getSearchOptions()
        },
        ...command,
      );

      return {
        count: results[0],
        query: command.join(' '),
        data: arrayToHash(results as [number, ...(string | string[])[]])
      };
    } catch (e) {
      console.error({ query: command.join(' '), error: e.message });

      throw e;
    }
  }

  workflow = {}
}

export { BaseEntity };
