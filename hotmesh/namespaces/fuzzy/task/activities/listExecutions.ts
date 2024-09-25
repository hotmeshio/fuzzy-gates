import { GPT } from "../../../../../lib/gpt";
import { findTaskDetails, findTasks, mapLeafTasks, resolveId } from "./_utils";

import { APIErrorResponse } from "../../../../../types/gpt";
import { ExecutionResponse } from "../../../../../types/task";
import { Socket } from "../../../../../http/utils/socket";

/**
 * Evaluate the gestalt of a target task list in order
 * to perform executions of the instructions
 */
export const doListExecutions = async (originId: string, targetId: string, config: {database: string, namespace: string, model?: string}): Promise<ExecutionResponse | APIErrorResponse | void> => {
  const tasks = await findTasks(originId, config, 'y');
  const primaryTask = tasks.find(step => step?._depth.split('.').length === 1);

  let content: string;
  if (targetId) {
    const { ancestorTasks, priorSibling, followingSibling } = findTaskDetails(tasks, targetId);
    content = `
      #ROLE :: Task Operationalizer
      #ASSIGNMENT :: If CURRENT TASK is too-coarse given the PRINCIPLES and CONTEXT and would benefit from increased detail, recommend using the JSON format shown. Never overexplain! Return an empty list if adequate.
      #UNIVERSAL PRINCIPLES :: ${primaryTask._context}
      #CURRENT TASK ANCESTRAL CONTEXT :: ${ancestorTasks.join('/')}
      #PRECEDING SIBLING TASK :: ${priorSibling ?? '-'}
      #FOLLOWING SIBLING TASK :: ${followingSibling ?? '-'}
      #JSON RESPONSE FORMAT :: { "output": [{ "id": "...", "result": "...task execution result..."}]}
      #CURRENT TASK :: ${mapLeafTasks(tasks, targetId)}
    `;
  } else {
    content = `
      #ROLE :: Task Operationalizer
      #ASSIGNMENT :: Perform each individual instruction in the CURRENT TASK OUTLINE, according to CONTEXT. RETURN the individual results as shown in the JSON RESPONSE.
      #UNIVERSAL PRINCIPLES :: ${primaryTask._context}
      #PRIMARY TASK :: 1. ${primaryTask._task}
      #JSON RESPONSE FORMAT :: { "output": [{ "id": "...", "result": "...task execution result..."},]}
      #CURRENT TASK OUTLINE :: ${mapLeafTasks(tasks)}
    `;
  }
  const emphasis = 'RETURN stringified JSON. NEVER include additional content or wrap. RESPONSE begins with { AND ends with }';

  Socket.broadcast('mesh.planes.control', {
    data: { activity: 'listExecutions', id: targetId ?? originId, request: content },
    metadata: {
      timestamp: Date.now(),
      statusCode: 200,
      status: 'success'
    }
  });

  const llMResponse = await GPT.evaluateGestalt([
    {role: 'system', content },
    {role: 'system', content: emphasis },
  ]) as ExecutionResponse;

  // Resolve the task IDs returned by the LLM
  llMResponse.output.forEach((execution) => {
    execution.id = resolveId(execution.id, tasks, false);
  });
  return llMResponse;
}
