import { ExecutionResponse } from "../../../../../types/task";
import { findEntity } from "../../../../manifest";

/**
 * Execute task instructions, using suggestions from the LLM
 */
export const doExecuteTasks = async (tasks: ExecutionResponse, config: {database: string, namespace: string}): Promise<number> => {
  const task = findEntity(config.database, config.namespace, 'task');
  for (const result of tasks.output) {
    const guid = result.id;
    await task.meshData.set(
      'task',
      guid,
      { namespace: config.namespace,
        search: {
          data: {
            result: result.result
          },
        }
      }
    );  
  }
  return tasks?.output?.length ?? 0;
}
