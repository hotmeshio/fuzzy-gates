import { MeshData } from '@hotmeshio/hotmesh';
import * as listPrunes from '../activities/listPrunables';
import * as pruneTasks from '../activities/pruneTasks';

import { PruneResponse, WorkflowInput } from "../../../types/task";

const { doListPrunables } = MeshData.proxyActivities<typeof listPrunes>({
  activities: listPrunes
});
const { doPruneTasks } = MeshData.proxyActivities<typeof pruneTasks>({
  activities: pruneTasks
});

export const pruneTaskTree = async(input: WorkflowInput): Promise<number> => {
  const prunableTasks = await doListPrunables(input) as PruneResponse;
  const pruneCount = await doPruneTasks(prunableTasks.prune, input);
  return pruneCount;
}
