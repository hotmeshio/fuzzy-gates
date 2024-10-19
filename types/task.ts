/**
 * Public HTTP Test route input payload/body
 */
export type TaskInput = {
  origin: string;  //top-level task (1) (all subtasks subordinate to this)
  context: string;
  global: string;
  current: string;
  depth: string; //'1.2.4.7' (unique path)
  preceding?: string; // preceding step
  following?: string; // following step
  ancestors?: string[]; // all ancestors
  siblings?: string[]; // all siblings
};

type ItemDetails = {
  item: string;
  quantity: number;
  unit: string;
};

export type InstructionResponse = {
  instructions: string;
  inputs: ItemDetails[];
  outputs: ItemDetails[];
};

export type Gestalt = {
  id: string;
  critique: string;
  substitution: string;
  prune?: boolean;
};

export type GestaltResponse = Gestalt[];

export type TasksResponse = {
  tasks: string[];
};

export type TaskOutput = InstructionResponse | TasksResponse;

export type TaskInstruction = {
  context: string
  instructions: string;
};

export type PruneResponse = {
  prune: string[];
};

type Clarification = {
  id: string;
  clarification: string;
};

export type ClarifyResponse = {
  clarify: Clarification[];
};

export type ExecutionResponse = {
  output: string;
};

type Expansion = {
  id: string;
  depth: string;
  subtasks: string[];
  ancestors: string[];
  task: string;
};

export type ExpansionResponse = {
  expand: Expansion[];
};

export type PruneTarget = 'y' | 'n' | 'y|n';

export type RawTask = {
  $: string;
  _depth: string;
  _task: string;
  _instructions?: string;
  _inputs?: string;
  _outputs?: string;
  _context?: string;
  _result?: string;
}

export type TaskConfig = {
  origin?: string, //top-level task guid (task-Hxxx)
  namespace: string,
  taskQueue?: string,
  entity?: string,
  database?: string,
  context?: string,
  model?: string, //ai model
};

export type WorkflowInput = {
  /**
   * The target task entity to target when present (otherwise origin task is used)
   */
  id?: string | null | undefined;
  /**
   * The are the args for the main entry workflow
   */
  args?: TaskInput;
  /**
   * General config like namespace, database, since a multi-server/multi-app architecture
   */
  config: TaskConfig;
}

/**
 * HTTP endpoints to create and update tasks
 * expects optional configuration in the payload
 * body to override defaults (like setting model
 * and context).
 */
export type TaskAPIConfig = {
  target?: string,
  model?: string,   //gpt-4o
  context?: string  //You are an expert in this field...
}

export type TaskExport = {
  $: string;
  _depth: string;
  _active: string;
  _task: string;
  _instructions?: string;
  _inputs?: string;
  _outputs?: string;
  _result?: string;
};

export type ExportFormat = 'markdown' | 'html';
