import { MeshData } from '@hotmeshio/hotmesh';
import { expandTaskTree } from '../workflows/expandTaskTree';


export const connectExpandHook = async (meshData: MeshData, options: { namespace: string, taskQueue: string }): Promise<void> => {
  await meshData.connect({
    entity: 'task.expand',
    target: expandTaskTree,
    options,
  });
};
