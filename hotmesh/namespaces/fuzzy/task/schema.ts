import { Types } from '@hotmeshio/hotmesh';

export const schema: Types.WorkflowSearchSchema = {
  $entity: {
    type: 'TAG',
    indexed: false,
    primitive: 'string',
    required: true
  },
  id: {
    type: 'TAG',
    primitive: 'string',
    required: true,
    examples: ['H56789'],
  },
  origin: {
    type: 'TAG',
    primitive: 'string',
    required: true,
    examples: ['H56789'],
  },
  task: {
    type: 'TEXT',
    primitive: 'string',
    required: true,
    examples: ['Make a cake.'],
  },
  global: {
    type: 'TEXT',
    primitive: 'string',
    required: true,
    examples: ['Make a cake.'],
  },
  result: {
    type: 'TEXT',
    primitive: 'string',
    required: true,
    examples: ['5 plus 5 is 10'],
  },
  instructions: {
    type: 'TEXT',
    primitive: 'string',
    required: true,
    examples: ['Bake the cake.'],
  },
  inputs: {
    type: 'TEXT',
    primitive: 'string',
    required: false,
    examples: ['{ ingredient: \'salt\', quantity: 1, unit: \'tsp\' }'],
  },
  outputs: {
    type: 'TEXT',
    primitive: 'string',
    required: false,
    examples: ['{ ingredient: \'flour\', quantity: 2, unit: \'pounds\' }'],
  },
  depth: {
    type: 'TEXT',
    primitive: 'string',
    required: true,
    nostem: true,
    sortable: true,
    examples: ['1', '1.2'],
  },
  active: {
    type: 'TAG',
    primitive: 'string',
    required: true,
    examples: ['y', 'n'],
  },
};
