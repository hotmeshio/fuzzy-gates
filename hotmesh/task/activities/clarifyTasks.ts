import { MeshOS } from "@hotmeshio/hotmesh";

import { Socket } from "../../../http/utils/socket";
import { ClarifyResponse, WorkflowInput } from "../../../types/task";

/**
 * Clarify task instructions, using suggestions from the LLM
 */
export const doClarifyTasks = async (tasks: ClarifyResponse, input: WorkflowInput): Promise<number> => {
  const task = MeshOS.findEntity(input.config.database, input.config.namespace, 'task');
  for (const clarification of tasks.clarify) {
    //persist the clarification to the db
    const guid = clarification.id;
    await task.meshData.set(
      'task',
      guid,
      { namespace: input.config.namespace,
        search: {
          data: {
            instructions: clarification.clarification
          },
        }
      }
    );

    //emit clarification to the UI
    Socket.broadcast('mesh.planes.control', {
      data: { activity: 'clarifyTask', data: {
        id: input.id ?? input.config.origin,
        instructions: clarification.clarification,
      }},
      metadata: {
        timestamp: Date.now(),
        statusCode: 200,
        status: 'success'
      }
    });
  }
  return tasks?.clarify?.length ?? 0;
}
