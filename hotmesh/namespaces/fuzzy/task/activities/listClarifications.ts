import { GPT } from "../../../../../lib/gpt";
import { findTaskDetails, findTasks, mapLeafTasks, resolveId } from "./_utils";

import { APIErrorResponse } from "../../../../../types/gpt";
import { ClarifyResponse, RawTask } from "../../../../../types/task";
import { Socket } from "../../../../../http/utils/socket";

/**
 * Evaluate the gestalt of a target task list.
 * Clarify any single instruction that is unclear or ambiguous.
 * Do NOT descend or create subtasks (next step).
 */
export const doListClarifications = async (originId: string, targetId: string | null, config: {database: string, namespace: string}): Promise<ClarifyResponse | APIErrorResponse | void> => {
  const tasks = await findTasks(originId, config, 'y');
  const primaryTask = tasks.find(step => step?._depth.split('.').length === 1);

  //if targeting a specific task, modify the assignment
  let content: string;
  if (targetId) {
    const { ancestorTasks, priorSibling, followingSibling } = findTaskDetails(tasks, targetId);
    content = `
      #ROLE :: Task Outline Clarifier
      #ASSIGNMENT :: If CURRENT TASK is too-coarse given the PRINCIPLES and CONTEXT and would benefit from increased detail, recommend using the JSON format shown. Never overexplain! Return an empty list if adequate.
      #UNIVERSAL PRINCIPLES :: ${primaryTask._context}
      #CURRENT TASK ANCESTRAL CONTEXT :: ${ancestorTasks.join('/')}
      #PRECEDING SIBLING TASK :: ${priorSibling ?? '-'}
      #FOLLOWING SIBLING TASK :: ${followingSibling ?? '-'}
      #JSON RESPONSE FORMAT :: { "clarify": [{ "id": "...", "clarification": "...clarified instructions..."},]}
      #CURRENT TASK :: ${mapLeafTasks(tasks, targetId)}
    `;
  } else {
    content = `
      #ROLE :: Task Outline Clarifier
      #ASSIGNMENT :: Critique the gestalt of the CURRENT TASK OUTLINE. Identify tasks/instructions in the tree that should be clarified when judged according to PRINCIPLES and PRIMARY TASK. Traverse the tree from parent to child and child to parent to ensure proper stepwise analysis. If task instructions can be substantively improved for any task that would improve the set, recommend using the JSON format shown
      #UNIVERSAL PRINCIPLES :: ${primaryTask._context}
      #PRIMARY TASK :: 1. ${primaryTask._task}
      #JSON RESPONSE FORMAT :: { "clarify": [{ "id": "...", "clarification": "...clarified instructions..."},]}
      #CURRENT TASK OUTLINE :: ${mapLeafTasks(tasks, targetId)}
    `;
  }

  const emphasis = 'RETURN stringified JSON. NEVER include additional content or wrap. RESPONSE begins with { AND ends with }';

  Socket.broadcast('mesh.planes.control', {
    data: { activity: 'listClarifications', id: targetId ?? originId, request: content },
    metadata: {
      timestamp: Date.now(),
      statusCode: 200,
      status: 'success'
    }
  });

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
