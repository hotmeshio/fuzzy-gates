import { MeshData } from '@hotmeshio/hotmesh';
import * as listExecutions from '../activities/listExecutions';
import * as executeTasks from '../activities/executeTasks';

import { ExecutionResponse, WorkflowInput } from '../../../types/task';

const { doListExecutions } = MeshData.proxyActivities<typeof listExecutions>({
  activities: listExecutions
});
const { doExecuteTasks } = MeshData.proxyActivities<typeof executeTasks>({
  activities: executeTasks
});

export const executeTaskTree = async(input: WorkflowInput): Promise<number> => {
  const llMResponse = await doListExecutions(input) as ExecutionResponse;
  const count = await doExecuteTasks(llMResponse, input);
  return count;
}
