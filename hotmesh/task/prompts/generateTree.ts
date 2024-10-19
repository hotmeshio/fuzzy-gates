// generateTree.ts
import { TaskInput } from "../../../types/task";

export const assignment = `Determine whether the CURRENT TASK can be executed without confusion as a single transitive task or if it should be subdivided into subtasks. Subtasks must be transitive/transformative and assumed to have defined inputs/states and defined outputs/states. Anticipate eventual Depth Limit during earlier steps and adjust subtask granularity as needed.`;

export const assignmentTerminal = `CREATE final instructions for the CURRENT TASK including duration if relevant. Return \`inputs\` and \`outputs\` if necessary.`;

export const emphasis = `DO NOT descend beyond 4 depth levels #.#.#.#! DO NOT overexplain; they are EXPERTS in the field! return STRINGIFIED JSON. NEVER include additional content/wrap. RESPONSE begins with { AND ends with }`;

export const generateTaskTreePrompt = (taskInput: TaskInput, terminal: boolean): string => {
  return `
    #ROLE :: Evaluator
    #CONTEXT :: ${taskInput.context}
    #CUSTOMER REQUEST :: ${taskInput.global}
    #CURRENT TASK ANCESTRAL CONTEXT :: ${taskInput.ancestors ? taskInput.ancestors.join('>>') : '-'}
    #SIBLING TASKS :: ${taskInput.siblings ? taskInput.siblings.join(' | ') : '-'}
    #PRECEDING SIBLING TASK :: ${taskInput.preceding ?? '-'}
    #CURRENT TASK :: ${taskInput.current}
    #FOLLOWING SIBLING TASK :: ${taskInput.following ?? '-'}
    #CURRENT TASK DEPTH/POSITION :: ${taskInput.depth}
    #ASSIGNMENT :: ${terminal ? assignmentTerminal : assignment}
    #RESPONSE FORMAT IF SUFFICIENTLY GRANULAR :: { "instructions": "...", "inputs": [{"item": "", "quantity": #, "unit": ""},], "outputs": [{"item": "", "quantity": #, "unit": ""},] }
    #RESPONSE FORMAT OTHERWISE :: { "tasks": ["...", "...",] }
  `;
};

export const generateTerminalPrompt = (taskInput: TaskInput): string => {
  return `
    #ROLE :: Evaluator
    #CONTEXT :: ${taskInput.context}
    #CUSTOMER REQUEST :: ${taskInput.global}
    #CURRENT TASK ANCESTRAL CONTEXT :: ${taskInput.ancestors ? taskInput.ancestors.join('>>') : '-'}
    #PRECEDING SIBLING TASK :: ${taskInput.preceding ?? '-'}
    #CURRENT TASK :: ${taskInput.current}
    #FOLLOWING SIBLING TASK :: ${taskInput.following ?? '-'}
    #CURRENT TASK DEPTH/POSITION :: ${taskInput.depth}
    #ASSIGNMENT :: ${assignmentTerminal}
    #RESPONSE FORMAT :: { "instructions": "...", "inputs": [{"item": "", "quantity": #, "unit": ""},], "outputs": [{"item": "", "quantity": #, "unit": ""},] }
  `;
};
