import { MeshData } from "@hotmeshio/hotmesh";
import { TaskConfg } from "../../../../../types/task";

export const restore = async (id: string, meshData: MeshData, config: TaskConfg): Promise<{ hookId: string }> => {
  const hookId = await meshData.hook({
    entity: config.entity,
    id,
    hookEntity: `${config.entity}.restore`,
    hookArgs: [{ ...config }],
    options: {
      namespace: config.namespace,
      taskQueue: config.taskQueue,
    }
  });

  return { hookId };
};
