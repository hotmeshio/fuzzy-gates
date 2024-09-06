import { MeshData } from '@hotmeshio/hotmesh';
import * as activities from '../activities/restoreTasks';

const { doRestoreTasks } = MeshData.proxyActivities<typeof activities>({ activities});

/**
 * restore all pruned tasks (set active = 'y')
 */
export const restoreTaskTree = async(config: { database: string, namespace: string}): Promise<number> => {
  const restoreCount = await doRestoreTasks(
    MeshData.workflow.getContext().workflowId,
    config,
  );
  console.log('RESTORED >', restoreCount);
  return Date.now();
}
