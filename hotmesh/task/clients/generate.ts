import { MeshData } from '@hotmeshio/hotmesh';
import { WorkflowInput } from '../../../types/task';

export const generate = async (meshData: MeshData, input: WorkflowInput): Promise<{ id: string }> => {
  await meshData.exec<string>({
    entity: input.config.entity,
    args: [{ ...input.args }],
    options: {
      id: input.args.origin,
      ttl: 'infinity',
      namespace: input.config.namespace,
      taskQueue: input.config.taskQueue,
      await: false,
      search: {
        //seed workflow with record data (immediately indexed/searchable)
        data: {
          global: input.args.global,
          context: input.args.context,
          depth: input.args.depth, 
          task: input.args.current,
          instructions: '',
          active: 'y',
        }
      }
    },
  });
  return { id: input.args.origin };
};
