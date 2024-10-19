import { MeshOS } from "@hotmeshio/hotmesh";

import { Socket } from "../../../http/utils/socket";
import { ExecutionResponse, WorkflowInput } from "../../../types/task";

/**
 * Save the execution response returned from the LLM
 */
export const doExecuteTasks = async (response: ExecutionResponse, input: WorkflowInput): Promise<number> => {
  const task = MeshOS.findEntity(input.config.database, input.config.namespace, 'task');
  const result = response.output;
  await task.meshData.set(
    'task',
    input.id ?? input.config.origin,
    { namespace: input.config.namespace,
      search: {
        data: {
          result
        },
      }
    }
  );

  //emit execution output to the UI (so it can update)
  Socket.broadcast('mesh.planes.control', {
    data: { activity: 'executeTasks', data: {
      id: input.id,
      result,
    }},
    metadata: {
      timestamp: Date.now(),
      statusCode: 200,
      status: 'success'
    }
  });
  return 1;
}
