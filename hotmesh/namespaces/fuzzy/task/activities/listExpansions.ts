import { GPT } from "../../../../../lib/gpt";
import { findAncestorTasks, findDBTask, findOrigin, findTasks, mapLeafTasks, resolveId } from "./_utils";

import { APIErrorResponse } from "../../../../../types/gpt";
import { ExpansionResponse } from "../../../../../types/task";

/**
 * Evaluates the gestalt of a target task list.
 * Identifies `instructional` tasks (leaves) that can be expanded
 * (into branches) with subtasks (child leaves).
 */
export const doListExpansions = async (originId: string, config: {database: string, namespace: string}): Promise<[ExpansionResponse, string, string] | APIErrorResponse | void> => {
  const tasks = await findTasks(originId, config, 'y');
  const primaryTask = await findOrigin(originId, config);

  const content = `
    #ROLE :: Task Expander
    #ASSIGNMENT :: Critique the gestalt of the CURRENT TASK OUTLINE. Identify too-coarse tasks that benefit from increased granularity. Create TRANSITIVE subtasks with defined inputs/states and defined outputs/states that substantively improve the too-coarse task. Never overexplain! Return an empty list if adequate.
    #CONTEXT (JUDGE GESTALT ACCORDING TO) :: 1. ${primaryTask._task}
    #JSON RESPONSE FORMAT :: { "expand": [{ "id": "...", "subtasks": ["...", "...",]},]}
    #CURRENT TASK OUTLINE :: ${mapLeafTasks(tasks)}
  `;
  const emphasis = 'RETURN stringified JSON. NEVER include additional content or wrap. RESPONSE begins with { AND ends with }';

  console.log('EXPANSION REQUEST >', content);
  const llMResponse = await GPT.evaluateGestalt([
    {role: 'system', content },
    {role: 'system', content: emphasis },
  ]) as ExpansionResponse;

  // expand llMResponse with task data
  llMResponse.expand.forEach((expansion) => {
    expansion.id = resolveId(expansion.id, tasks, false);
    expansion.ancestors = findAncestorTasks(expansion.id, tasks);
    const dbTask = findDBTask(expansion.id, tasks);
    expansion.depth = dbTask?._depth;
    expansion.task = dbTask?._task;
  });
  return [llMResponse, primaryTask._task, primaryTask._context];
}
