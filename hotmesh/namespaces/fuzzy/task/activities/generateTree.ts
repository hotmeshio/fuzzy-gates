import { Socket } from "../../../../../http/utils/socket";
import { GPT } from "../../../../../lib/gpt";
import { APIErrorResponse } from "../../../../../types/gpt";
import { TaskInput, TaskOutput } from "../../../../../types/task";

/**
 * Core function to generate a task tree; recursively generates subtasks
 * until the depth limit is reached. The strategy effectively connects
 * one-shot prompts using transitive verbs decided upon by the LLM.
 * 
 * This allows for a simple seed command to generate a complex task tree
 * when the depth is set to a high value and the context is sufficiently
 * defined.
 */
export const doGenerateTaskTree = async (taskInput: TaskInput): Promise<TaskOutput | APIErrorResponse> => {
  const assignment = 'Determine whether the CURRENT TASK can be executed without confusion as a single transitive task or if they should be broken down into subtasks. Subtasks must be transitive/transformative and assumed to have defined inputs/states and defined outputs/states. RETURN final instructions, not subtasks, if depth > 4 levels. Never overexplain! Anticipate eventual Depth Limit during earlier steps and adjust subtask granularity as needed.';
  const assignmentTerminal = 'CREATE final instructions for the CURRENT TASK including duration if relevant. Return `inputs` and `outputs` if necessary.';
  const emphasis = 'DO NOT descend beyond 4 depth levels #.#.#.#! DO NOT overexplain; they are EXPERTS in the field! return STRINGIFIED JSON. NEVER include additional content/wrap. RESPONSE begins with { AND ends with }';

  const terminal = taskInput.depth.split('.').length > 3;

  // Define the LLM query if not too deep
  const content = `
    #ROLE :: Evaluator
    #CONTEXT :: ${taskInput.context}
    #CUSTOMER REQUEST :: ${taskInput.global}
    #CURRENT TASK ANCESTRAL CONTEXT :: ${taskInput.ancestors ? taskInput.ancestors.join('/') : '-'}
    #PRECEDING SIBLING TASK :: ${taskInput.preceding ?? '-'}
    #CURRENT TASK :: ${taskInput.current}
    #FOLLOWING SIBLING TASK :: ${taskInput.following ?? '-'}
    #CURRENT TASK DEPTH/POSITION :: ${taskInput.depth}
    #ASSIGNMENT :: ${terminal ? assignmentTerminal : assignment}
    #RESPONSE FORMAT IF SUFFICIENTLY GRANULAR :: { "instructions": "...", "inputs": [{"item": "", "quantity": #, "unit": ""},], "outputs": [{"item": "", "quantity": #, "unit": ""},] }
    #RESPONSE FORMAT OTHERWISE :: { "tasks": ["...", "...",] }
  `;

  //if too deep, return terminal instructions
  const contentTerminal = `
    #ROLE :: Evaluator
    #CONTEXT :: ${taskInput.context}
    #CUSTOMER REQUEST :: ${taskInput.global}
    #CURRENT TASK ANCESTRAL CONTEXT :: ${taskInput.ancestors ? taskInput.ancestors.join('/') : '-'}
    #PRECEDING SIBLING TASK :: ${taskInput.preceding ?? '-'}
    #CURRENT TASK :: ${taskInput.current}
    #FOLLOWING SIBLING TASK :: ${taskInput.following ?? '-'}
    #CURRENT TASK DEPTH/POSITION :: ${taskInput.depth}
    #ASSIGNMENT :: ${assignmentTerminal}
    #RESPONSE FORMAT :: { "instructions": "...", "inputs": [{"item": "", "quantity": #, "unit": ""},], "outputs": [{"item": "", "quantity": #, "unit": ""},] }
  `;

  Socket.broadcast('mesh.planes.control', {
    data: { activity: 'generateTaskTree', content: terminal ? contentTerminal : content },
    metadata: {
      timestamp: Date.now(),
      statusCode: 200,
      status: 'success'
    }
  });
  
  return await GPT.generateTaskTree([
    {role: 'system', content: terminal ? contentTerminal : content },
    {role: 'system', content: emphasis },
  ]);
}
