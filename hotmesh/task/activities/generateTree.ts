import { Socket } from "../../../http/utils/socket";
import { GPT } from "../../../lib/gpt";
import { APIErrorResponse } from "../../../types/gpt";
import { TaskInput, TaskOutput } from "../../../types/task";
import { emphasis, generateTaskTreePrompt, generateTerminalPrompt } from "../prompts/generateTree";

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
  const terminal = taskInput.depth.split('.').length > 3;

  // Define the LLM query if not too deep
  const content = terminal ? generateTerminalPrompt(taskInput) : generateTaskTreePrompt(taskInput, terminal);

  Socket.broadcast('mesh.planes.control', {
    data: { activity: 'generateTaskTree', content },
    metadata: {
      timestamp: Date.now(),
      statusCode: 200,
      status: 'success'
    }
  });
  
  return await GPT.generateTaskTree([
    {role: 'system', content },
    {role: 'system', content: emphasis },
  ]);
};
