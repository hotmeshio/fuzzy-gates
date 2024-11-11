import * as Redis from 'redis';
import { MeshOS } from '@hotmeshio/hotmesh';
import { Types } from '@hotmeshio/hotmesh';

import { Task } from '../../hotmesh/task';
import { schema as FuzzyTaskSchema } from '../../hotmesh/task/schema';

//register the components as a mesh
export const configureHotMesh = () => {
  MeshOS.registerDatabase('redis', {
    name: 'Redis',
    label: 'redis/redis-stack7.2.0',
    search: true,
    connection: {
      class: Redis,
      options: {
        url: 'redis://:key_admin@redis:6379',
      }
    }
  });

  MeshOS.registerEntity('fuzzy-task', {
    name: 'task',
    label: 'Task',
    schema: FuzzyTaskSchema,
    class: Task,
  });

  //supports many-to-many
  MeshOS.registerNamespace('fuzzy', {
    name: 'Fuzzy',
    type: 'fuzzy',
    label: 'Fuzzy Playground',
    entities: [
      MeshOS.entities['fuzzy-task'],
    ],
  });

  //supports many-to-many
  MeshOS.registerProfile('redis', {
    db: MeshOS.databases.redis,
    namespaces: {
      fuzzy: MeshOS.namespaces.fuzzy,
    }
  });

  MeshOS.registerSchema('fuzzy-task', FuzzyTaskSchema as Types.WorkflowSearchSchema);

  MeshOS.registerClass('Task', Task);
};

export const initializeHotMesh = async () => {
  configureHotMesh();
  await MeshOS.init();
};

// Utility function to get entity instance
export const getEntityInstance = (database: string, namespace: string, entity: string) => {
  return MeshOS.findEntity(database, namespace, entity);
};

// Utility function to get schemas
export const getSchemas = (database: string, namespace: string) => {
  return MeshOS.findSchemas(database, namespace);
};

// Utility function to get JSON representation of profiles
export const getProfilesJSON = () => {
  return MeshOS.toJSON();
};
