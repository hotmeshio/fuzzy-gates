import { GPT } from "../../../../../lib/gpt";
import { APIErrorResponse } from "../../../../../types/gpt";
import { PruneResponse, RawTask } from "../../../../../types/task";
import { findTasks, mapLeafTasks, resolveId } from "./_utils";

/**
 * Evaluate the gestalt of a target task list to determine redundant
 * leaves and prune from the task outline.
 */
export const doListPrunables = async (originId: string, config: {database: string, namespace: string}): Promise<PruneResponse | APIErrorResponse> => {
  const tasks = await findTasks(originId, config, 'y');
  const primaryTask = tasks.find(step => step?._depth.split('.').length === 1);

  const content = `
    #ROLE :: Redundancy Pruner
    #ASSIGNMENT :: Critique the gestalt of the CURRENT TASK OUTLINE. Identify redundant and duplicate tasks in the tree that should be pruned given the CONTEXT. Traverse the tree from parent to child and child to parent to ensure proper stepwise analysis. Only identify redundant tasks not original tasks.
    #CONTEXT (JUDGE GESTALT ACCORDING TO) :: 1. ${primaryTask._task}
    #RESPONSE FORMAT :: { "prune": ["...", "...", "...'] }
    #CURRENT TASK OUTLINE :: ${mapLeafTasks(tasks)}
  `;
  const emphasis = 'RETURN stringified JSON. NEVER include additional content or wrap. RESPONSE begins with { AND ends with }';


  console.log('PRUNABLES REQUEST >', content);
  const toPrune = await GPT.evaluateGestalt([
    {role: 'system', content },
    {role: 'system', content: emphasis },
  ]) as PruneResponse;

  // Resolve the task IDs returned by the LLM
  const pruneList = toPrune.prune.map((id: string) => {
    return resolveId(id, tasks, true);
  });
  return { prune: pruneList };
}
