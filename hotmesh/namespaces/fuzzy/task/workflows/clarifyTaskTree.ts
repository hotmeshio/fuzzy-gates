import { MeshData } from '@hotmeshio/hotmesh';
import * as listClarifications from '../activities/listClarifications';
import * as clarifyTasks from '../activities/clarifyTasks';

import { ClarifyResponse } from '../../../../../types/task';

const { doListClarifications } = MeshData.proxyActivities<typeof listClarifications>({
  activities: listClarifications
});
const { doClarifyTasks } = MeshData.proxyActivities<typeof clarifyTasks>({
  activities: clarifyTasks
});

export const clarifyTaskTree = async(config: { database: string, namespace: string}): Promise<number> => {
  const llmTasks = await doListClarifications(
    MeshData.workflow.getContext().workflowId,
    config,
  ) as ClarifyResponse;

  const count = await doClarifyTasks(llmTasks, config);
  console.log('CLARIFIED COUNT >', count);
  return Date.now();
}
