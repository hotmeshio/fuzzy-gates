import { MeshData } from "@hotmeshio/hotmesh";
import { WorkflowInput } from "../../../types/task";

export const prune = async (meshData: MeshData, input: WorkflowInput): Promise<{ hookId: string }> => {
  const hookId = await meshData.hook({
    entity: input.config.entity,
    id: input.id,
    hookEntity: 'task.prune',
    hookArgs: [{ ...input }],
    options: {
      namespace: input.config.namespace,
      taskQueue: input.config.taskQueue,
    }
  });

  return { hookId };
};
