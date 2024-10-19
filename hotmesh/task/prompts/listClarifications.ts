// prompts/listClarifications.ts
import { WorkflowInput } from "../../../types/task";

export const clarifyAssignment = `Your ROLE is to CLARIFY the CURRENT TASK INSTRUCTIONS and output your response using the JSON RESPONSE FORMAT. The UNIVERSAL PRINCIPLES should guide your strategy as you ruminate about how to improve and clarify the CURRENT TASK INSTRUCTIONS. They serve as a guide. Return an empty 'clarify' Array if clarity is sufficient.`;

export const gestaltAssignment = `Critique the gestalt of the CURRENT TASK OUTLINE. Identify tasks/instructions in the tree that should be clarified when judged according to PRINCIPLES and PRIMARY TASK. Traverse the tree from parent to child and child to parent to ensure proper stepwise analysis. If task instructions can be substantively improved for any task that would improve the set, recommend using the JSON format shown.`;

export const emphasis = `RETURN stringified JSON. NEVER include additional content or wrap. RESPONSE begins with { AND ends with }`;

export const generateClarifyPrompt = (input: WorkflowInput, targetDetails: any): string => {
  const { ancestorTasks, targetTask, targetSiblings, parentSiblings } = targetDetails;
  const depth = targetTask._depth.split('.').length;
  return `
    #ROLE :: Task Outline Clarifier
    #ASSIGNMENT :: ${clarifyAssignment}
    #UNIVERSAL PRINCIPLES :: ${input.config.context ?? targetTask._context}
    #ANCESTOR TASKS :: ${ancestorTasks.length > 1 ? ancestorTasks.join('> ') : '-'}
    ${depth > 2 ? 'PARENT GENERATION TASKS' : 'PARENT TASK'}  :: ${parentSiblings.join(', ')}
    #CURRENT GENERATION TASKS:: ${targetSiblings.join(', ')}
    #JSON RESPONSE FORMAT :: { "clarify": [{ "id": "...", "clarification": "...clarified instructions..."},]}
    #CURRENT TASK INSTRUCTIONS :: ${targetTask._instructions}
  `;
};

export const generateGestaltPrompt = (input: WorkflowInput, primaryTask: any, tasks: any[]): string => {
  return `
    #ROLE :: Task Outline Clarifier
    #ASSIGNMENT :: ${gestaltAssignment}
    #UNIVERSAL PRINCIPLES :: ${primaryTask._context}
    #PRIMARY TASK :: 1. ${primaryTask._task}
    #JSON RESPONSE FORMAT :: { "clarify": [{ "id": "...", "clarification": "...clarified instructions..."},]}
    #CURRENT TASK OUTLINE :: ${tasks.map(task => task._task).join(', ')}
  `;
};
