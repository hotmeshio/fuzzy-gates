import { GPT } from "../../../../../lib/gpt";
import { findTasks, mapLeafTasks, resolveId } from "./_utils";

import { APIErrorResponse } from "../../../../../types/gpt";
import { ClarifyResponse, RawTask } from "../../../../../types/task";

/**
 * Evaluate the gestalt of a target task list.
 * Clarify any single instruction that is unclear or ambiguous.
 * Do NOT descend or create subtasks (next step).
 */
export const doListClarifications = async (originId: string, config: {database: string, namespace: string}): Promise<ClarifyResponse | APIErrorResponse | void> => {
  const tasks = await findTasks(originId, config, 'y');
  const primaryTask = tasks.find(step => step?._depth.split('.').length === 1);

  const content = `
    #ROLE :: Task Outline Clarifier
    #ASSIGNMENT :: Critique the gestalt of the CURRENT TASK OUTLINE. Identify tasks/instructions in the tree that should be clarified when judged according to CONTEXT. Traverse the tree from parent to child and child to parent to ensure proper stepwise analysis. If task instructions can be substantively improved for any task that would improve the set, recommend using the JSON format shown.
    #CONTEXT (JUDGE GESTALT ACCORDING TO) :: 1. ${primaryTask._task}
    #JSON RESPONSE FORMAT :: { "clarify": [{ "id": "...", "clarification": "...clarified instructions..."},]}
    #CURRENT TASK OUTLINE :: ${mapLeafTasks(tasks)}
  `;
  const emphasis = 'RETURN stringified JSON. NEVER include additional content or wrap. RESPONSE begins with { AND ends with }';

  console.log('CLARIFICATION REQUEST >', content);
  const llMResponse = await GPT.evaluateGestalt([
    {role: 'system', content },
    {role: 'system', content: emphasis },
  ]) as ClarifyResponse;

  // Resolve the task IDs returned by the LLM
  llMResponse.clarify.forEach((clarification) => {
    clarification.id = resolveId(clarification.id, tasks, false);
  });
  return llMResponse;
}
