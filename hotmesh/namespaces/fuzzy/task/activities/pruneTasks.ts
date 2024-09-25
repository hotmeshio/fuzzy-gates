import { Socket } from "../../../../../http/utils/socket";
import { findEntity } from "../../../../manifest";

/**
 * find target tasks and prune from the task list;
 * (set 'active' to 'n')
 */
export const doPruneTasks = async (originIds: string[], config: {database: string, namespace: string}): Promise<number> => {
  Socket.broadcast('mesh.planes.control', {
    data: { activity: 'pruneTasks', ids: originIds },
    metadata: {
      timestamp: Date.now(),
      statusCode: 200,
      status: 'success'
    }
  });
  
  const task = findEntity(config.database, config.namespace, 'task');
  for (const originId of originIds) {
    await task.meshData.set(
      'task',
      originId,
      { namespace: config.namespace,
        search: {
          data: {
            active: 'n'
          },
        }
      }
    );
  }

  return originIds.length;
}
