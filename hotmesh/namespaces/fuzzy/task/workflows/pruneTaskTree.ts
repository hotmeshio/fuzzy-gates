import { MeshData } from '@hotmeshio/hotmesh';
import * as listPrunes from '../activities/listPrunables';
import * as pruneTasks from '../activities/pruneTasks';

import { PruneResponse } from "../../../../../types/task";

const { doListPrunables } = MeshData.proxyActivities<typeof listPrunes>({
  activities: listPrunes
});
const { doPruneTasks } = MeshData.proxyActivities<typeof pruneTasks>({
  activities: pruneTasks
});

export const pruneTaskTree = async(config: { database: string, namespace: string}): Promise<number> => {
  const prunableTasks = await doListPrunables(
    MeshData.workflow.getContext().workflowId,
    config,
  ) as PruneResponse;

  await doPruneTasks(prunableTasks.prune, config);

  return Date.now();
}
