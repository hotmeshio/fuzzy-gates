import { MeshOS } from "@hotmeshio/hotmesh";

import { Socket } from "../../../http/utils/socket";
import { findTasks } from "./_utils";
import { WorkflowInput } from "../../../types/task";

/**
 * Restore all pruned tasks (set active = 'y')
 */
export const doRestoreTasks = async (input: WorkflowInput): Promise<number> => {
  const tasks = await findTasks(input.config.origin, input.config, 'n');
  const taskIds = tasks.map(task => task.$) as string[];

  const task = MeshOS.findEntity(input.config.database, input.config.namespace, 'task');
  for (const taskId of taskIds) {
    const [_hm, _ns, _j, ...rest] = taskId.split(':');
    const [_entity, ...guid] = rest.join(':').split('-');
    const id = guid.join('-');
    await task.meshData.set(
      'task',
      id,
      { namespace: input.config.namespace,
        search: {
          data: {
            active: 'y'
          },
        }
      }
    );  

    Socket.broadcast('mesh.planes.control', {
      data: { activity: 'restoreTask', data: {
        id: `task-${id}`,
        active: 'y',
      }},
      metadata: {
        timestamp: Date.now(),
        statusCode: 200,
        status: 'success'
      }
    });
  }
  return taskIds.length;
}
