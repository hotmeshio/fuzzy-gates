import { MeshData } from "@hotmeshio/hotmesh";
import { WorkflowInput } from "../../../types/task";

export const clarify = async (meshData: MeshData, input: WorkflowInput): Promise<{ hookId: string }> => {
  const hookId = await meshData.hook({
    entity: input.config.entity,
    id: input.id,
    hookEntity: 'task.clarify',
    hookArgs: [{ ...input }],
    options: {
      namespace: input.config.namespace,
      taskQueue: input.config.taskQueue,
    }
  });

  return { hookId };
};
