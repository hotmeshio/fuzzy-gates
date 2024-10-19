import { MeshData } from '@hotmeshio/hotmesh';
import { clarifyTaskTree } from '../workflows/clarifyTaskTree';


export const connectClarifyHook = async (meshData: MeshData, options: { namespace: string, taskQueue: string }): Promise<void> => {
  await meshData.connect({
    entity: 'task.clarify',
    target: clarifyTaskTree,
    options,
  });
};
