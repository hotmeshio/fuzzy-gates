// listPrunables.ts
import { Socket } from "../../../http/utils/socket";
import { GPT } from "../../../lib/gpt";
import { APIErrorResponse } from "../../../types/gpt";
import { PruneResponse, WorkflowInput } from "../../../types/task";
import { findTasks, resolveId } from "./_utils";
import { emphasis, generatePrunePrompt } from "../prompts/listPrunables";

/**
 * Evaluate the gestalt of a target task list to determine redundant
 * leaves and prune from the task outline.
 */
export const doListPrunables = async (input: WorkflowInput): Promise<PruneResponse | APIErrorResponse> => {
  console.log(input);
  const tasks = await findTasks(input.config.origin, input.config, 'y');
  const primaryTask = tasks.find(step => step?._depth.split('.').length === 1);

  const content = generatePrunePrompt(input, primaryTask, tasks);

  Socket.broadcast('mesh.planes.control', {
    data: { activity: 'listPrunables', id: input.config.origin, request: content },
    metadata: {
      timestamp: Date.now(),
      statusCode: 200,
      status: 'success'
    }
  });

  const toPrune = await GPT.evaluateGestalt([
    {role: 'system', content },
    {role: 'system', content: emphasis },
  ]) as PruneResponse;

  Socket.broadcast('mesh.planes.control', {
    data: { activity: 'listPrunables', id: input.config.origin, response: toPrune },
    metadata: {
      timestamp: Date.now(),
      statusCode: 200,
      status: 'success'
    }
  });

  // verify/fix the task IDs returned by the LLM
  const pruneList = toPrune.prune.map((id: string) => {
    return resolveId(id, tasks, true);
  });

  return { prune: pruneList };
};
