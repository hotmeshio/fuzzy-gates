import { MeshData } from '@hotmeshio/hotmesh';
import { executeTaskTree } from '../workflows/executeTaskTree';


export const connectExecuteHook = async (meshData: MeshData, options: { namespace: string, taskQueue: string }): Promise<void> => {
  await meshData.connect({
    entity: 'task.execute',
    target: executeTaskTree,
    options,
  });
};
