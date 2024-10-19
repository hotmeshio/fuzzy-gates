// listExecutions.ts
import { GPT } from "../../../lib/gpt";
import { findTaskDetails, findTasks } from "./_utils";

import { APIErrorResponse } from "../../../types/gpt";
import { ExecutionResponse, WorkflowInput } from "../../../types/task";
import { Socket } from "../../../http/utils/socket";
import { emphasis, generateExecutionPrompt } from "../prompts/listExecutions";

/**
 * Evaluate the gestalt of a target task list in order
 * to perform executions of the instructions
 */
export const doListExecutions = async (input: WorkflowInput): Promise<ExecutionResponse | APIErrorResponse | void> => {
  const tasks = await findTasks(input.config.origin, input.config);
  const isTargeted = !!input.id;
  let targetDetails = null;

  if (isTargeted) {
    targetDetails = findTaskDetails(tasks, input.id);
  }

  const content = generateExecutionPrompt(input, targetDetails, tasks, isTargeted);

  Socket.broadcast('mesh.planes.control', {
    data: { activity: 'listExecutions', id: input.id ?? input.config.origin, request: content },
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

  Socket.broadcast('mesh.planes.control', {
    data: { activity: 'listExecutions', id: input.id ?? input.config.origin, response: llMResponse },
    metadata: {
      timestamp: Date.now(),
      statusCode: 200,
      status: 'success'
    }
  });

  return llMResponse;
};
