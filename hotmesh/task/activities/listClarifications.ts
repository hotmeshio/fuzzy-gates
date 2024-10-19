// listClarifications.ts
import { GPT } from "../../../lib/gpt";
import { findTaskDetails, findTasks, resolveId } from "./_utils";

import { APIErrorResponse } from "../../../types/gpt";
import { ClarifyResponse, WorkflowInput } from "../../../types/task";
import { Socket } from "../../../http/utils/socket";
import { emphasis, generateClarifyPrompt, generateGestaltPrompt } from '../prompts/listClarifications'

/**
 * Evaluate the gestalt of a target task (or task list).
 * Clarify target instruction(s) that are unclear or ambiguous.
 * If a target task is provided, only clarify that task.
 * Do NOT descend or create subtasks.
 */
export const doListClarifications = async (input: WorkflowInput): Promise<ClarifyResponse | APIErrorResponse | void> => {
  const tasks = await findTasks(input.config.origin, input.config);
  const primaryTask = tasks.find(step => step?._depth.split('.').length === 1);

  //if targeting a specific task, modify the assignment
  let content: string;
  if (input.id) {
    const targetDetails = findTaskDetails(tasks, input.id);
    content = generateClarifyPrompt(input, targetDetails);
  } else {
    content = generateGestaltPrompt(input, primaryTask, tasks);
  }

  Socket.broadcast('mesh.planes.control', {
    data: { activity: 'listClarifications', id: input.id ?? input.config.origin, request: content },
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

  Socket.broadcast('mesh.planes.control', {
    data: { activity: 'listClarifications', id: input.id ?? input.config.origin, response: llMResponse },
    metadata: {
      timestamp: Date.now(),
      statusCode: 200,
      status: 'success'
    }
  });

  // verify/fix the task IDs returned by the LLM
  llMResponse.clarify.forEach((clarification) => {
    clarification.id = resolveId(clarification.id, tasks, false);
  });

  return llMResponse;
};
