import { MeshData } from '@hotmeshio/hotmesh';
import * as activities from '../activities/generateTree';
import { paddedNumber } from '../../../../../modules/utils';
import { TaskInput, TasksResponse } from '../../../../../types/task';

const { doGenerateTaskTree } = MeshData.proxyActivities<typeof activities>({ activities });

/**
 * recursively generates a task tree
 */
export const generateTaskTree = async(input: TaskInput): Promise<number> => {
  const id = MeshData.workflow.getContext().workflowId;
  const search = await MeshData.workflow.search();
  await search.set(
    '$entity', 'task',            //task, recipe, repository etc
    'id', id,
    'origin', input.origin,       //top-level task guid
    'parent', input.parent ?? '', //parent task guid
    'task', input.current,
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
    const results = await MeshData.workflow.search();
    await results.set(
      'instructions', response.instructions,
      'inputs', response.inputs ? JSON.stringify(response.inputs) : '',
      'outputs', response.outputs ? JSON.stringify(response.outputs) : '',
    );
  } else if ('tasks' in response) {
    return await createSubtasks(id, input, response);
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
export const createSubtasks = async(id: string, input: TaskInput, response: TasksResponse): Promise<number> => {
  console.log('CREATE SUBTASKS >', id, response);
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
    const task = response.tasks[i];

    items.push(MeshData.workflow.execChild<number>({
      args: [{
        ...input,
        parent: id,
        current: task,
        depth: `${input.depth}.${paddedNumber(i + 1)}`,
        preceding: i ? response.tasks[i - 1] : '-',
        following: i < response.tasks.length - 1 ? response.tasks[i + 1] : '-',
        ancestors,
      }],
      taskQueue: 'v1',
      entity: 'task',
      signalIn: true,
    }));
  }
  await Promise.all(items);
  return items.length;
}
