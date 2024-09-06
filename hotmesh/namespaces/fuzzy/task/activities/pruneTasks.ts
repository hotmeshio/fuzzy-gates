import { findEntity } from "../../../../manifest";

/**
 * find target tasks and prune from the task list;
 * (set 'active' to 'n')
 */
export const doPruneTasks = async (originIds: string[], config: {database: string, namespace: string}): Promise<number> => {
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
