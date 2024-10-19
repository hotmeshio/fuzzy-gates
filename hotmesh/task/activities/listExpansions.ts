// listExpansions.ts
import { GPT } from "../../../lib/gpt";
import { findAncestorTasks, findDBTask, findTaskDetails, findTasks, resolveId } from "./_utils";

import { APIErrorResponse } from "../../../types/gpt";
import { ExpansionResponse, WorkflowInput } from "../../../types/task";
import { Socket } from "../../../http/utils/socket";
import { emphasis, generateExpansionPrompt } from "../prompts/listExpansions";

/**
 * Evaluates the gestalt of a target task list.
 * Identifies `instructional` tasks (leaves) that can be expanded
 * (into branches) with subtasks (child leaves).
 */
export const doListExpansions = async (input: WorkflowInput): Promise<[ExpansionResponse, string, string, string] | APIErrorResponse | void> => {
  const tasks = await findTasks(input.config.origin, input.config);
  const isTargeted = !!input.id;
  let targetDetails = null;

  if (isTargeted) {
    targetDetails = findTaskDetails(tasks, input.id);
  }

  const content = generateExpansionPrompt(input, targetDetails, tasks, isTargeted);

  Socket.broadcast('mesh.planes.control', {
    data: { activity: 'listExpansions', id: input.id ?? input.config.origin, request: content },
    metadata: {
      timestamp: Date.now(),
      statusCode: 200,
      status: 'success'
    }
  });

  const llMResponse = await GPT.evaluateGestalt([
    {role: 'system', content },
    {role: 'system', content: emphasis },
  ]) as ExpansionResponse;

  Socket.broadcast('mesh.planes.control', {
    data: { activity: 'listExpansions', id: input.id ?? input.config.origin, response: llMResponse },
    metadata: {
      timestamp: Date.now(),
      statusCode: 200,
      status: 'success'
    }
  });

  if (isTargeted) {
    const actualResponse = llMResponse as unknown as {subtasks: string[]};
    if (actualResponse?.subtasks?.length) {
      llMResponse.expand = [{
        id: input.id,
        ancestors: findAncestorTasks(input.id, tasks),
        depth: targetDetails.targetTask._depth,
        task: targetDetails.targetTask._task,
        subtasks: actualResponse.subtasks
      }];
    } else {
      llMResponse.expand = [];
    }
    delete actualResponse?.subtasks;
  } else {
    llMResponse.expand.forEach((expansion) => {
      expansion.id = resolveId(expansion.id, tasks, false);
      expansion.ancestors = findAncestorTasks(expansion.id, tasks);
      const dbTask = findDBTask(expansion.id, tasks);
      expansion.depth = dbTask?._depth;
      expansion.task = dbTask?._task;
    });
  }

  return [
    llMResponse,
    tasks.find(task => task?._depth.split('.').length === 1)?._task,
    tasks.find(task => task?._depth.split('.').length === 1)?._context,
    input.config.origin.substring(5)
  ];
};
