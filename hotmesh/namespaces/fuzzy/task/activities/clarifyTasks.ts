import { Socket } from "../../../../../http/utils/socket";
import { ClarifyResponse } from "../../../../../types/task";
import { findEntity } from "../../../../manifest";

/**
 * Clarify task instructions, using suggestions from the LLM
 */
export const doClarifyTasks = async (tasks: ClarifyResponse, config: {database: string, namespace: string}): Promise<number> => {
  Socket.broadcast('mesh.planes.control', {
    data: { activity: 'clarifyTasks', tasks },
    metadata: {
      timestamp: Date.now(),
      statusCode: 200,
      status: 'success'
    }
  });
  
  const task = findEntity(config.database, config.namespace, 'task');
  for (const clarification of tasks.clarify) {
    const guid = clarification.id;
    await task.meshData.set(
      'task',
      guid,
      { namespace: config.namespace,
        search: {
          data: {
            instructions: clarification.clarification
          },
        }
      }
    );  
  }
  return tasks?.clarify?.length ?? 0;
}
