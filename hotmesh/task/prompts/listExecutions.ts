// prompts/listExecutions.ts
import { WorkflowInput } from "../../../types/task";

export const executeAssignment = `Execute the CURRENT TASK INSTRUCTIONS, producing a concrete result as described by the task.`;

export const emphasis = `RETURN stringified JSON. NEVER include additional content or wrap. RESPONSE begins with { AND ends with }`;

export const generateExecutionPrompt = (input: WorkflowInput, targetDetails: any, tasks: any[], isTargeted: boolean): string => {
  if (isTargeted) {
    const { ancestorTasks, priorSibling, followingSibling } = targetDetails;
    return `
      #ROLE :: Task Operationalizer/Executor
      #ASSIGNMENT :: ${executeAssignment}
      #UNIVERSAL PRINCIPLES :: ${input.config.context ?? targetDetails.targetTask._context}
      #CURRENT TASK ANCESTOR TASKS :: ${ancestorTasks.join('/')}
      #PRECEDING SIBLING TASK :: ${priorSibling ?? '-'}
      #FOLLOWING SIBLING TASK :: ${followingSibling ?? '-'}
      #JSON RESPONSE FORMAT :: { "output": "...task execution result..." }
      #CURRENT TASK INSTRUCTIONS :: ${tasks.find(task => task._id === input.id)?._instructions}
    `;
  } else {
    const primaryTask = tasks.find(step => step?._depth.split('.').length === 1);
    return `
      #ROLE :: Task Operationalizer
      #ASSIGNMENT :: ${executeAssignment}
      #UNIVERSAL PRINCIPLES :: ${input.config.context ?? primaryTask._context}
      #JSON RESPONSE FORMAT :: { "output": "...task execution result..." }
      #CURRENT TASK INSTRUCTIONS :: ${tasks.map(task => task._task).join(', ')}
    `;
  }
};
