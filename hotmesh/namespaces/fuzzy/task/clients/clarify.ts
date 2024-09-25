import { MeshData } from "@hotmeshio/hotmesh";
import { TaskConfg } from "../../../../../types/task";

export const clarify = async (id: string, target: string, meshData: MeshData, config: TaskConfg): Promise<{ hookId: string }> => {
  const hookId = await meshData.hook({
    entity: config.entity,
    id,
    hookEntity: `${config.entity}.clarify`,
    hookArgs: [target, { ...config }],
    options: {
      namespace: config.namespace,
      taskQueue: config.taskQueue,
    }
  });

  return { hookId };
};
