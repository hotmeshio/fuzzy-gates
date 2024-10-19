import { MeshData } from '@hotmeshio/hotmesh';
import { pruneTaskTree } from '../workflows/pruneTaskTree';


export const connectPruneHook = async (meshData: MeshData, options: { namespace: string, taskQueue: string }): Promise<void> => {
  await meshData.connect({
    entity: 'task.prune',
    target: pruneTaskTree,
    options,
  });
};
