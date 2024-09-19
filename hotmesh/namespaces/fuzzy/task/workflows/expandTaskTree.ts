import { MeshData } from '@hotmeshio/hotmesh';
import * as listExpansions from '../activities/listExpansions';
import { ExpansionResponse, TaskInput } from '../../../../../types/task';

const { doListExpansions } = MeshData.proxyActivities<typeof listExpansions>({
  activities: listExpansions
});


/**
 * establishes the gestalt of the task tree and expands any terminal
 * leaves that lack sufficient transitive granularity
 */
export const expandTaskTree = async(target: string, config: { database: string, namespace: string}): Promise<number> => {
  // query the LLM for tasks that require expansion
  const [tasksToExpand, globalTask, globalContext] = await doListExpansions(
    MeshData.workflow.getContext().workflowId,
    config,
  ) as [ExpansionResponse, string, string];

  // expand each task into subtasks
  const origin = MeshData.workflow.getContext().workflowId;
  for (const task of tasksToExpand?.expand) {
    const input: TaskInput = {
      current: task.task,
      parent: '',
      preceding: '',
      following: '',
      origin: origin.split('-')[1],
      depth: task.depth,
      global: globalTask,
      context: globalContext,
      ancestors: [...task.ancestors],
    };

    //use target if it exists
    await MeshData.workflow.hook({
      workflowId: `task-${task.id}`,
      args: [`task-${task.id}`, input, { tasks: task.subtasks }],
      taskQueue: 'v1',
      entity: 'task.subtask',
    });
  }
  return Date.now();
}
