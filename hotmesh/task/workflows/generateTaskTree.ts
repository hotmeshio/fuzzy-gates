import { MeshData } from '@hotmeshio/hotmesh';
import * as activities from '../activities/generateTree';
import { paddedNumber } from '../../../modules/utils';
import { TaskInput, TasksResponse } from '../../../types/task';
import { Socket } from '../../../http/utils/socket';
import { cleanTask } from '../activities/_utils';

const { doGenerateTaskTree } = MeshData.proxyActivities<typeof activities>({ activities });

/**
 * recursively generates a task tree
 */
export const generateTaskTree = async(input: TaskInput): Promise<number> => {
  const id = MeshData.workflow.getContext().workflowId;
  const search = await MeshData.workflow.search();
  await search.set(
    '$entity', 'task',
    'id', id,
    'origin', input.origin,       //top-level task guid (H569r5...)
    'task', input.current,        //current transitive task
    'depth', input.depth,
    'active', 'y',
    'inputs', '',
    'outputs', '',
    'instructions', '',
    'tasks', '',
    'result', '',
  );

  //ask the LLM for how to proceed (save task instructions or create subtasks)
  const response = await doGenerateTaskTree({
    ...input,
    ancestors: input.ancestors ?? [] 
  });

  if ('instructions' in response) {
    //emit socket event to update the UI
    Socket.broadcast('mesh.planes.control', {
      data: { activity: 'generateTaskTree', data: {
        ...input,
        id,
        active: 'y',
        task: input.current,
        instructions: response.instructions,
        inputs: JSON.stringify(response.inputs || []),
        outputs: JSON.stringify(response.outputs || []),
        result: '',
        $: `hmsh:fuzzy:j:${id}`,
      }},
      metadata: {
        timestamp: Date.now(),
        statusCode: 200,
        status: 'success'
      }
    });

    const results = await MeshData.workflow.search();
    await results.set(
      'instructions', response.instructions,
      'inputs', response.inputs ? JSON.stringify(response.inputs) : '',
      'outputs', response.outputs ? JSON.stringify(response.outputs) : '',
    );
  } else if ('tasks' in response) {
    //emit socket event to update the UI
    Socket.broadcast('mesh.planes.control', {
      data: { activity: 'generateTaskTree', data: {
        ...input,
        id,
        active: 'y',
        task: input.current,
        instructions: '',
        inputs: '',
        outputs:'',
        result: '',
        $: `hmsh:fuzzy:j:${id}`,
      }},
      metadata: {
        timestamp: Date.now(),
        statusCode: 200,
        status: 'success'
      }
    });
    return await createSubtasks(input, response);
  } 

  return Date.now();
};

/**
 * not enough granularity, create transitive subtasks;
 * 
 * NOTE: This method is called by the main task tree generator
 *       when the intial tree is created; AND it is called as
 *       a `hook` by the expandTaskTree `workflow`
 */
export const createSubtasks = async(input: TaskInput, response: TasksResponse): Promise<number> => {
  const results = await MeshData.workflow.search();
  await results.set(
    'instructions', '',
    'inputs', '',
    'outputs', '',
    'result', '',
  );

  const items = [];
  let ancestors: string[] = input.ancestors ?? [];
  ancestors.push(input.current);
  for (let i = 0; i < response.tasks.length; i++) {
    if (i === 25) break; //limit to 25 subtasks

    const task = cleanTask(response.tasks[i]);

    items.push(MeshData.workflow.execChild<number>({
      args: [{
        ...input,
        current: task,
        depth: `${input.depth}.${paddedNumber(i + 1)}`,
        preceding: i ? response.tasks[i - 1] : '-',
        following: i < response.tasks.length - 1 ? response.tasks[i + 1] : '-',
        siblings: response.tasks,
        ancestors,
      }],
      taskQueue: 'v1',
      entity: 'task',
      signalIn: true, //ensures child stays transactionally active even after the main method completes
    }));
  }
  await Promise.all(items);
  return items.length;
}
