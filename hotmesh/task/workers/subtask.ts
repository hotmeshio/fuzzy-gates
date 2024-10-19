import { MeshData } from '@hotmeshio/hotmesh';
import { createSubtasks } from '../workflows/generateTaskTree';


export const connectSubtaskHook = async (meshData: MeshData, options: { namespace: string, taskQueue: string }): Promise<void> => {
  await meshData.connect({
    entity: 'task.subtask',
    target: createSubtasks,
    options,
  });
};
