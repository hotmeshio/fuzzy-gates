import { findEntity } from "../../../../manifest";
import { findTasks } from "./_utils";

/**
 * Restore all pruned tasks (set active = 'y')
 */
export const doRestoreTasks = async (originId: string, config: {database: string, namespace: string}): Promise<number> => {
  const tasks = await findTasks(originId, config, 'n');
  const taskIds = tasks.map(task => task.$) as string[];

  const task = findEntity(config.database, config.namespace, 'task');
  for (const taskId of taskIds) {
    const [_hm, _ns, _j, ...rest] = taskId.split(':');
    const [_entity, ...guid] = rest.join(':').split('-');
    await task.meshData.set(
      'task',
      guid.join('-'),
      { namespace: config.namespace,
        search: {
          data: {
            active: 'y'
          },
        }
      }
    );  
  }
  return taskIds.length;
}
