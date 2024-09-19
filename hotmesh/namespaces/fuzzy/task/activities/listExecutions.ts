import { GPT } from "../../../../../lib/gpt";
import { findTasks, mapLeafTasks, resolveId } from "./_utils";

import { APIErrorResponse } from "../../../../../types/gpt";
import { ExecutionResponse } from "../../../../../types/task";

/**
 * Evaluate the gestalt of a target task list in order
 * to perform executions of the instructions
 */
export const doListExecutions = async (originId: string, config: {database: string, namespace: string}): Promise<ExecutionResponse | APIErrorResponse | void> => {
  const tasks = await findTasks(originId, config, 'y');
  const primaryTask = tasks.find(step => step?._depth.split('.').length === 1);

  const content = `
    #ROLE :: Task Operationalizer
    #ASSIGNMENT :: Perform each individual instruction in the CURRENT TASK OUTLINE, according to CONTEXT. RETURN the individual results as shown in the JSON RESPONSE.
    #CONTEXT (JUDGE GESTALT ACCORDING TO) :: 1. ${primaryTask._task}
    #JSON RESPONSE FORMAT :: { "output": [{ "id": "...", "result": "...task execution result..."},]}
    #CURRENT TASK OUTLINE :: ${mapLeafTasks(tasks)}
  `;
  const emphasis = 'RETURN stringified JSON. NEVER include additional content or wrap. RESPONSE begins with { AND ends with }';

  console.log('EXECUTION REQUEST >', content);
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
