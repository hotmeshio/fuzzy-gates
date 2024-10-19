// prompts/listPrunables.ts
import { WorkflowInput } from "../../../types/task";

export const pruneAssignment = `Critique the gestalt of the CURRENT TASK OUTLINE. Identify redundant and duplicate tasks in the tree that should be pruned given the CONTEXT. Traverse the tree from parent to child and child to parent to ensure proper stepwise analysis. Only identify redundant tasks not original tasks.`;

export const emphasis = `RETURN stringified JSON. NEVER include additional content or wrap. RESPONSE begins with { AND ends with }`;

export const generatePrunePrompt = (input: WorkflowInput, primaryTask: any, tasks: any[]): string => {
  return `
    #ROLE :: Redundancy Pruner
    #ASSIGNMENT :: ${pruneAssignment}
    #CONTEXT (JUDGE GESTALT ACCORDING TO) :: 1. ${primaryTask._task}
    #RESPONSE FORMAT :: { "prune": ["...", "...", "..."] }
    #CURRENT TASK OUTLINE :: ${tasks.map(task => task._task).join(', ')}
  `;
};
