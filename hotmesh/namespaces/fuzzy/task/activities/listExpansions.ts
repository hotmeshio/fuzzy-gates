import { GPT } from "../../../../../lib/gpt";
import { findAncestorTasks, findDBTask, findOrigin, findTaskDetails, findTasks, mapLeafTasks, resolveId } from "./_utils";

import { APIErrorResponse } from "../../../../../types/gpt";
import { ExpansionResponse } from "../../../../../types/task";
import { StringStringType } from "@hotmeshio/hotmesh/build/types";
import { Socket } from "../../../../../http/utils/socket";

/**
 * Evaluates the gestalt of a target task list.
 * Identifies `instructional` tasks (leaves) that can be expanded
 * (into branches) with subtasks (child leaves).
 */
export const doListExpansions = async (originId: string, targetId: string | null, config: {database: string, namespace: string}): Promise<[ExpansionResponse, string, string] | APIErrorResponse | void> => {
  const tasks = await findTasks(originId, config, 'y');
  const primaryTask = await findOrigin(originId, config);

  let content: string;
  let resolvedTargetTask: StringStringType;
  if (targetId) {
    const { ancestorTasks, targetTask, priorSibling, followingSibling } = findTaskDetails(tasks, targetId);
    resolvedTargetTask = targetTask;
    content = `
      #ROLE :: Task Expander
      #ASSIGNMENT :: Critique the CURRENT TASK. If it is too-coarse given the context and instructions and would benefit from increased granularity, subdivide the task into TRANSITIVE subtasks with defined inputs/states and defined outputs/states that substantively improve the too-coarse task. Never overexplain! Return an empty list if adequate.
      #UNIVERSAL PRINCIPLES :: ${primaryTask._context}
      #CURRENT TASK ANCESTRAL CONTEXT :: ${ancestorTasks.join('/')}
      #PRECEDING SIBLING TASK :: ${priorSibling ?? '-'}
      #FOLLOWING SIBLING TASK :: ${followingSibling ?? '-'}
      #JSON RESPONSE FORMAT :: { "subtasks": ["...", "...",] }
      #CURRENT TASK :: ${targetTask}
    `;
  } else {
    content = `
      #ROLE :: Task Expander
      #ASSIGNMENT :: Critique the gestalt of the CURRENT TASK OUTLINE. Identify too-coarse tasks that benefit from increased granularity. Create TRANSITIVE subtasks with defined inputs/states and defined outputs/states that substantively improve the too-coarse task. Never overexplain! Return an empty list if adequate.
      #UNIVERSAL PRINCIPLES :: ${primaryTask._context}
      #PRIMARY TASK :: 1. ${primaryTask._task}
      #JSON RESPONSE FORMAT :: { "expand": [{ "id": "...", "subtasks": ["...", "...",]},]}
      #CURRENT TASK OUTLINE :: ${mapLeafTasks(tasks)}
    `;
  }
  const emphasis = 'RETURN stringified JSON. NEVER include additional content or wrap. RESPONSE begins with { AND ends with }';

  Socket.broadcast('mesh.planes.control', {
    data: { activity: 'listExpansions', id: targetId ?? originId, request: content },
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
    data: { activity: 'listExpansions', id: targetId ?? originId, response: content },
    metadata: {
      timestamp: Date.now(),
      statusCode: 200,
      status: 'success'
    }
  });

  // expand llMResponse with task data
  if (targetId) {
    const actualResponse = llMResponse as undefined as {subtasks: string[]};
    llMResponse.expand = [{
      id: targetId,
      ancestors: findAncestorTasks(targetId, tasks),
      depth: resolvedTargetTask._depth,
      task: resolvedTargetTask._task,
      subtasks: actualResponse.subtasks
    }];
    delete actualResponse.subtasks;
  } else {
    llMResponse.expand.forEach((expansion) => {
      expansion.id = resolveId(expansion.id, tasks, false);
      expansion.ancestors = findAncestorTasks(expansion.id, tasks);
      const dbTask = findDBTask(expansion.id, tasks);
      expansion.depth = dbTask?._depth;
      expansion.task = dbTask?._task;
    });
  }

  console.log('EXPANSION RESPONSE >', JSON.stringify(llMResponse, null, 2));

  return [llMResponse, primaryTask._task, primaryTask._context];
}
