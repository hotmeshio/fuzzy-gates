import { MeshData } from '@hotmeshio/hotmesh';
import * as listExecutions from '../activities/listExecutions';
import * as executeTasks from '../activities/executeTasks';

import { ExecutionResponse } from '../../../../../types/task';

const { doListExecutions } = MeshData.proxyActivities<typeof listExecutions>({
  activities: listExecutions
});
const { doExecuteTasks } = MeshData.proxyActivities<typeof executeTasks>({
  activities: executeTasks
});

export const executeTaskTree = async(target: string | null, config: {database: string, namespace: string, model: string}): Promise<number> => {
  const llmTasks = await doListExecutions(
    MeshData.workflow.getContext().workflowId,
    target,
    config,
  ) as ExecutionResponse;

  const count = await doExecuteTasks(llmTasks, config);
  console.log('EXECUTION COUNT >', count);
  return Date.now();
}
