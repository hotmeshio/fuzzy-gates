import { MeshData } from '@hotmeshio/hotmesh';
import { restoreTaskTree } from '../workflows/restoreTaskTree';


export const connectRestoreHook = async (meshData: MeshData, options: { namespace: string, taskQueue: string }): Promise<void> => {
  await meshData.connect({
    entity: 'task.restore',
    target: restoreTaskTree,
    options,
  });
};
