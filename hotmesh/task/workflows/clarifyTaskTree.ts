import { MeshData } from '@hotmeshio/hotmesh';
import * as listClarifications from '../activities/listClarifications';
import * as clarifyTasks from '../activities/clarifyTasks';

import { ClarifyResponse, WorkflowInput } from '../../../types/task';

const { doListClarifications } = MeshData.proxyActivities<typeof listClarifications>({
  activities: listClarifications
});
const { doClarifyTasks } = MeshData.proxyActivities<typeof clarifyTasks>({
  activities: clarifyTasks
});

export const clarifyTaskTree = async(input: WorkflowInput): Promise<number> => {
  const llmTasks = await doListClarifications(input) as ClarifyResponse;
  const count = await doClarifyTasks(llmTasks, input);
  console.log('CLARIFIED COUNT >', count);
  return Date.now();
}
