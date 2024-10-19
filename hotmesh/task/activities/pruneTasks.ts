import { MeshOS } from "@hotmeshio/hotmesh";

import { Socket } from "../../../http/utils/socket";
import { WorkflowInput } from "../../../types/task";

/**
 * find target tasks and prune from the task list;
 * (set 'active' to 'n')
 */
export const doPruneTasks = async (ids: string[], input: WorkflowInput): Promise<number> => {
  if (Array.isArray(ids)) {
    const task = MeshOS.findEntity(input.config.database, input.config.namespace, 'task');
    for (const id of ids) {
      await task.meshData.set(
        'task',
        id,
        { namespace: input.config.namespace,
          search: {
            data: {
              active: 'n'
            },
          }
        }
      );

      Socket.broadcast('mesh.planes.control', {
        data: { activity: 'pruneTask', data: {
          id: `task-${id}`,
          active: 'n',
        }},
        metadata: {
          timestamp: Date.now(),
          statusCode: 200,
          status: 'success'
        }
      });
    }

    return ids.length;
  } else {
    console.log('ids is bogus', ids);
    return -1;
  }
}
