import { MeshData } from '@hotmeshio/hotmesh';
import { TaskConfg, TaskInput } from "../../../../../types/task";

export const generate = async (input: TaskInput, meshData: MeshData, config: TaskConfg): Promise<{ id: string }> => {
  meshData.exec<string>({
    entity: config.entity,
    args: [input],
    options: {
      id: input.origin,
      ttl: 'infinity',
      namespace: config.namespace,
      taskQueue: config.taskQueue,
      await: false,
      search: {
        data: {
          global: input.global,
          context: input.context,
        }
      }
    },
  });

  return { id: input.origin };
};
