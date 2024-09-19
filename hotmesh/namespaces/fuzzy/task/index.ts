import { Types } from '@hotmeshio/hotmesh';

import { schema } from './schema';
import { BaseEntity } from '../../base';
import { exportTasks } from './activities/_utils'
import { createSubtasks, generateTaskTree } from './workflows/generateTaskTree'
import { clarifyTaskTree } from './workflows/clarifyTaskTree'
import { executeTaskTree } from './workflows/executeTaskTree'
import { expandTaskTree } from './workflows/expandTaskTree'
import { pruneTaskTree } from './workflows/pruneTaskTree'
import { restoreTaskTree } from './workflows/restoreTaskTree'
import { generate as generateClient } from './clients/generate'
import { prune as pruneClient } from './clients/prune'
import { restore as restoreClient } from './clients/restore'
import { clarify as clarifyClient } from './clients/clarify'
import { execute as executeClient } from './clients/execute'
import { expand as expandClient } from './clients/expand'
import { TaskInput, ExportFormat } from '../../../../types/task';

/**
 * This file mainly serves to wire up workers, hooks, and
 * entry method used to invoke them. And it declares the
 * search options (schema) for the entity.
 */
class Task extends BaseEntity {

  //version
  getTaskQueue(): string {
    return 'v1';
  }

  //type (entity)
  getEntity(): string {
    return 'task';
  }

  //schema/field index
  getSearchOptions(): Types.WorkflowSearchOptions {
    return {
      index: `${this.getNamespace()}-${this.getEntity()}`,
      prefix: [this.getEntity()],
      schema,
    };
  }

  async connect() {
    //connect the workers and hooks
    await this._connect(this.getEntity(), generateTaskTree, 5);
    await this._connect(`${this.getEntity()}.prune`, pruneTaskTree, 2);
    await this._connect(`${this.getEntity()}.restore`, restoreTaskTree, 1);
    await this._connect(`${this.getEntity()}.clarify`, clarifyTaskTree, 1);
    await this._connect(`${this.getEntity()}.execute`, executeTaskTree, 1);
    await this._connect(`${this.getEntity()}.expand`, expandTaskTree, 1);
    await this._connect(`${this.getEntity()}.subtask`, createSubtasks, 1);
  }

  /**
   * connect 1+ worker/s
   * @private
   */
  async _connect(entity: string, target: (...args: any[]) => unknown, swarmCount = 1) {
    for (let i = 1; i <= swarmCount; i++) {
      await this.meshData.connect({
        entity,
        target,
        options: {
          namespace: this.getNamespace(),
          taskQueue: this.getTaskQueue(),
        },
      });
    }
  }

  /**
   * Create a new, generative task tree
   */
  async create(input: TaskInput): Promise<{ id: string }> {
    return await generateClient(input, this.meshData, this._clientOpts());
  }

  async prune(id: string, config: {database: string, namespace: string}): Promise<{ hookId: string }> {
    return await pruneClient(id, this.meshData, this._clientOpts(config));
  }

  async restore(id: string, config: {database: string, namespace: string}): Promise<{ hookId: string }> {
    return await restoreClient(id, this.meshData, this._clientOpts(config));
  }

  async clarify(id: string, config: {database: string, namespace: string}): Promise<{ hookId: string }> {
    return await clarifyClient(id, this.meshData, this._clientOpts(config));
  }

  async execute(id: string, config: {database: string, namespace: string}): Promise<{ hookId: string }> {
    return await executeClient(id, this.meshData, this._clientOpts(config));
  }

  async expand(id: string, target: string, config: {database: string, namespace: string}): Promise<{ hookId: string }> {
    return await expandClient(id, target, this.meshData, this._clientOpts(config));
  }

  async export(id: string, format: ExportFormat = 'html',  config: { namespace: string, database: string}): Promise<any> {
    return await exportTasks(id, format, config);
  }

  /**
   * client options when invoking workers/workflows or spawning hooks
   * @private
   */
  _clientOpts(config?: { namespace: string, database: string }) {
    return {
      entity: this.getEntity(),
      taskQueue: this.getTaskQueue(),
      namespace: config?.namespace ?? this.getNamespace(),
      database: config?.database ?? undefined,
    };
  }
}

export { Task };
