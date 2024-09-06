/**
 * Public HTTP Test route input payload/body
 */
export type TaskInput = {
  origin: string;  //top-level task (1) (all subtasks subordinate to this)
  context: string;
  global: string;
  current: string;
  parent?: string;   //parent task id (guid)
  depth: string; //'1.2.4.7' (unique path)
  preceding?: string; // preceding step
  following?: string; // following step
  ancestors?: string[]; // all ancestors
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
}

export type TaskConfg = {
  namespace: string,
  taskQueue: string,
  entity: string,
  database?: string,
};

export type TaskExport = {
  $: string;
  _depth: string;
  _active: string;
  _task: string;
  _instructions?: string;
  _inputs?: string;
  _outputs?: string;
};

export type ExportFormat = 'markdown' | 'html';
