import { MeshData } from '@hotmeshio/hotmesh';
import { generateTaskTree } from '../workflows/generateTaskTree';


export const connectGenerateWorkflow = async (meshData: MeshData, options: { namespace: string, taskQueue: string }): Promise<void> => {
  for (let i = 0; i < 5; i++) {
    await meshData.connect({
      entity: 'task',
      target: generateTaskTree,
      options,
    });
  }
};
