import { MeshOS } from '@hotmeshio/hotmesh';
import { Types } from '@hotmeshio/hotmesh';

import { schema } from './schema';
import { exportTasks } from './activities/_utils';
import { generate as generateClient } from './clients/generate';
import { prune as pruneClient } from './clients/prune';
import { restore as restoreClient } from './clients/restore';
import { clarify as clarifyClient } from './clients/clarify';
import { execute as executeClient } from './clients/execute';
import { expand as expandClient } from './clients/expand';
import { connectClarifyHook } from './workers/clarify';
import { connectGenerateWorkflow } from './workers/generate';
import { connectExecuteHook } from './workers/execute';
import { connectExpandHook } from './workers/expand';
import { connectPruneHook } from './workers/prune';
import { connectRestoreHook } from './workers/restore';
import { connectSubtaskHook } from './workers/subtask';

import { TaskInput, ExportFormat, TaskConfig } from '../../types/task';

/**
 * The code in this class is boiler-plate and is primarily
 * used to connect `workers` and `hooks`.
 * 
 * The standard `create` method is subclased and overidden
 * to trigger the `generateTaskTree` workflow, overriding the
 * original 'create' event into a multi-step transaction that both saves
 * record data and transactionally guarantees all subordinated workflows
 * that are spawned will complete as well.
 */
class Task extends MeshOS {

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

  /**
   * A lifecycle method called by the `BaseEntity`
   * superclass when BaseEntitiy.init() is called
   * to wire up workflow and hook workers.
   * 
   * NOTE: Hooks are a specialized type of Workflow. They run
   *       transactionally just like any standard workflow.
   *       But while the 'main' workflow will only ever execute
   *       once, the record may be kept active such that
   *       hooks (subworkflows) can augment, decorate, and evolve
   *       the record transactionally even after the main workflow
   *       has completed.
   */
  async connect() {
    const opts = {
      namespace: this.getNamespace(),
      taskQueue: this.getTaskQueue(),
    };

    await connectGenerateWorkflow(this.meshData, opts);

    await connectClarifyHook(this.meshData, opts);
    await connectExecuteHook(this.meshData, opts);
    await connectExpandHook(this.meshData, opts);
    await connectPruneHook(this.meshData, opts);
    await connectRestoreHook(this.meshData, opts);
    await connectSubtaskHook(this.meshData, opts);
  }

  /**
   * exports the task tree as markdown or html
   */
  async export(id: string, format: ExportFormat = 'html',  config: { namespace: string, database: string}): Promise<string> {
    return await exportTasks(id, format, config);
  }

  /**
   * Creates a new workflow (a new transitive task tree and 
   * the ensuing descendant tasks that will be recursively
   * generated as the LLM subdivides the original transitive
   * task input (e.g., 'make grilled Mexican street corn'))
   */
  async create(input: TaskInput): Promise<{ id: string }> {
    return await generateClient(
      this.meshData, 
      {
        args: input,
        config: this._clientOpts(),
      }
    );
  }

  /**
   * Prune task/s
   */
  async prune(id: string, config: TaskConfig): Promise<{ hookId: string }> {
    return await pruneClient(
      this.meshData, 
      {
        id,
        config: this._clientOpts({ ...config, origin: `task-${id}` }),
      }
    );
  }

  /**
   * Restore pruned task/s
   */
  async restore(id: string, config: TaskConfig): Promise<{ hookId: string }> {
    return await restoreClient(
      this.meshData, 
      {
        id,
        config: this._clientOpts({ ...config, origin: `task-${id}` }),
      }
    );
  }

  /**
   * Clarify a transitive task tree
   */
  async clarify(id: string, target: string | null, config: TaskConfig): Promise<{ hookId: string }> {
    return await clarifyClient(
      this.meshData, 
      {
        id: target,
        config: this._clientOpts({ ...config, origin: `task-${id}` }),
      }
    );
  }

  /**
   * Executes a task in the tree
   */
  async execute(id: string, target: string, config: TaskConfig): Promise<{ hookId: string }> {
    return await executeClient(
      this.meshData, 
      {
        id: target,
        config: this._clientOpts({ ...config, origin: `task-${id}` }),
      }
    );
  }

  /**
   * Expands a task in the tree
   */
  async expand(id: string, target: string, config: TaskConfig): Promise<{ hookId: string }> {
    return await expandClient(
      this.meshData, 
      {
        id: target,
        config: this._clientOpts({ ...config, origin: `task-${id}` }),
      }
    );
  }

  /**
   * Apply default config (entity, taskQueue, namespace)
   * @private
   */
  _clientOpts(config?: TaskConfig): { entity: string, taskQueue: string, namespace: string, database?: string, model?: string } {
    return {
      ...config,
      entity: this.getEntity(),
      taskQueue: this.getTaskQueue(),
      namespace: config?.namespace ?? this.getNamespace(),
    };
  }
}

export { Task };
