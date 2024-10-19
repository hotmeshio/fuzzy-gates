import { MeshData } from '@hotmeshio/hotmesh';
import * as listExpansions from '../activities/listExpansions';
import { ExpansionResponse, TaskConfig, TaskInput, WorkflowInput } from '../../../types/task';
import { Socket } from '../../../http/utils/socket';

const { doListExpansions } = MeshData.proxyActivities<typeof listExpansions>({
  activities: listExpansions
});


/**
 * establishes the gestalt of the task tree and expands any terminal
 * leaves that lack sufficient transitive granularity
 */
export const expandTaskTree = async(input: WorkflowInput): Promise<number> => {
  // query the LLM for tasks that require expansion
  const [tasksToExpand, globalTask, globalContext, globalOrigin] = await doListExpansions(input) as [ExpansionResponse, string, string, string];

  // expand each task into subtasks
  for (const task of tasksToExpand?.expand) {
    const input: TaskInput = {
      current: task.task,
      preceding: '',
      following: '',
      origin: globalOrigin,
      depth: task.depth,
      global: globalTask,
      context: globalContext,
      ancestors: [...task.ancestors],
    };

    //use target if it exists
    await MeshData.workflow.hook({
      workflowId: `task-${task.id}`,
      args: [input, { tasks: task.subtasks }],
      taskQueue: 'v1',
      entity: 'task.subtask',
    });

    //emit socket event to update the UI
    Socket.broadcast('mesh.planes.control', {
      data: { activity: 'expandTaskTree', data: {
        ...input,
        id: `task-${task.id}`,
        instructions: '',
        inputs: '',
        outputs:'',
        result: '',
        $: `hmsh:fuzzy:j:task-${task.id}`,
      }},
      metadata: {
        timestamp: Date.now(),
        statusCode: 200,
        status: 'success'
      }
    });
  }
  return Date.now();
}
