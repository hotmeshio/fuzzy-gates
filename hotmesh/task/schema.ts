import { Types } from '@hotmeshio/hotmesh';

/**
 * Schema definition for 'task-type' workflows. These properties are persisted
 * as indexed, searchable data fields on each workflow record.
 */
export const schema: Types.WorkflowSearchSchema = {
  /**
   * Entity tag for the workflow, representing its type. 
   * Indexed indicates if it's shared with the indexing service.
   */
  $entity: {
    type: 'TAG',
    indexed: false,
    primitive: 'string',
    required: true,
    examples: ['task'],
  },
  
  /**
   * Task ID, including the `task-` entity prefix.
   */
  id: {
    type: 'TAG',
    primitive: 'string',
    required: true,
    examples: ['H56789'],
  },
  
  /**
   * Origin task ID, without the `task-` entity prefix.
   */
  origin: {
    type: 'TAG',
    primitive: 'string',
    required: true,
    examples: ['H56789'],
  },
  
  /**
   * Depth of the task, representing hierarchy levels. 
   * Stemming is disabled and it's sortable for search ordering.
   */
  depth: {
    type: 'TEXT',
    primitive: 'string',
    required: true,
    nostem: true,
    sortable: true,
    examples: ['1', '1.06', '1.01.04'],
  },
  
  /**
   * Transitive task description.
   */
  task: {
    type: 'TEXT',
    primitive: 'string',
    required: true,
    examples: ['Make a cake.'],
  },
  
  /**
   * Detailed instructions for executing the task.
   */
  instructions: {
    type: 'TEXT',
    primitive: 'string',
    required: true,
    examples: ['Place the pan in the preheated oven.'],
  },
  
  /**
   * Inputs required for the task instructions (optional).
   */
  inputs: {
    type: 'TEXT',
    primitive: 'string',
    required: false,
    examples: ['{ ingredient: \'salt\', quantity: 1, unit: \'tsp\' }'],
  },
  
  /**
   * Outputs generated from the task (optional).
   */
  outputs: {
    type: 'TEXT',
    primitive: 'string',
    required: false,
    examples: ['{ ingredient: \'flour\', quantity: 2, unit: \'pounds\' }'],
  },
  
  /**
   * Result from operationalizing or executing the task instructions.
   */
  result: {
    type: 'TEXT',
    primitive: 'string',
    required: true,
    examples: ['5 plus 5 is 10'],
  },
  
  /**
   * Field indicating whether the task is active ('y') or pruned ('n').
   */
  active: {
    type: 'TAG',
    primitive: 'string',
    required: true,
    examples: ['y', 'n'],
  },
};
