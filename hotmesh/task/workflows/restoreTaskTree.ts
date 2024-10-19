import { MeshData } from '@hotmeshio/hotmesh';
import * as activities from '../activities/restoreTasks';
import { WorkflowInput } from '../../../types/task';

const { doRestoreTasks } = MeshData.proxyActivities<typeof activities>({ activities});

/**
 * restore all pruned tasks (set active = 'y')
 */
export const restoreTaskTree = async(input: WorkflowInput): Promise<number> => {
  return await doRestoreTasks(input);
}
