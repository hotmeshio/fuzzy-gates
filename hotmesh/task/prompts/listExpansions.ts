// prompts/listExpansions.ts
import { WorkflowInput } from "../../../types/task";

export const expandAssignmentTargeted = `Subdivide CURRENT TASK INSTRUCTIONS using the JSON format shown in context of UNIVERSAL PRINCIPLES if it would benefit. Always subdivide the task into TRANSITIVE subtasks with defined inputs/states and defined outputs/states that substantively improve the too-coarse task. Return an empty 'subtasks' Array if sufficiently subdivided.`;

export const expandAssignmentGeneral = `Critique the gestalt of the CURRENT TASK OUTLINE. Identify too-coarse tasks that benefit from increased granularity. Create TRANSITIVE subtasks with defined inputs/states and defined outputs/states that substantively improve the too-coarse task. Never overexplain! Return an empty list if adequate.`;

export const emphasis = `RETURN stringified JSON. NEVER include additional content or wrap. RESPONSE begins with { AND ends with }`;

export const generateExpansionPrompt = (input: WorkflowInput, targetDetails: any, tasks: any[], isTargeted: boolean): string => {
  if (isTargeted) {
    const { ancestorTasks, targetTask, targetSiblings, parentSiblings } = targetDetails;
    const depth = targetTask._depth.split('.').length;
    return `
      #ROLE :: Task Subdivider
      #ASSIGNMENT :: ${expandAssignmentTargeted}
      #UNIVERSAL PRINCIPLES :: ${input.config.context ?? targetTask._context}
      #ANCESTOR TASKS :: ${ancestorTasks.length > 1 ? ancestorTasks.join('>> ') : '-'}
      #${depth > 2 ? 'PARENT GENERATION TASKS' : 'PARENT TASK'}  :: ${parentSiblings.join(', ')}
      #CURRENT GENERATION TASKS:: ${targetSiblings.join(', ')}
      #JSON RESPONSE FORMAT :: { "subtasks": ["...", "...",] }
      #CURRENT TASK INSTRUCTIONS :: ${targetTask._instructions}
    `;
  } else {
    const primaryTask = tasks.find(step => step?._depth.split('.').length === 1);
    return `
      #ROLE :: Task Expander
      #ASSIGNMENT :: ${expandAssignmentGeneral}
      #UNIVERSAL PRINCIPLES :: ${primaryTask._context}
      #PRIMARY TASK :: 1. ${primaryTask._task}
      #JSON RESPONSE FORMAT :: { "expand": [{ "id": "...", "subtasks": ["...", "...",]},]}
      #CURRENT TASK OUTLINE :: ${tasks.map(task => task._task).join(', ')}
    `;
  }
};
