//import entity classes
import { Task } from '../namespaces/fuzzy/task';

//import entity schemas
import { schema as FuzzyTaskSchema } from '../namespaces/fuzzy/task/schema';
import { EntityInstanceTypes, Namespaces, Profiles } from '../../types/manifest';
import { Types } from '@hotmeshio/hotmesh';

/**
 * The dashboard will only load those backend dbs where the environment
 * variable is set to 'true'.
 */
const USE_REDIS = true;

/**
 * The dashboard service can surface multiple databases, each of which may
 * have multiple namespaces, each of which has multiple entities.
 */
export const dbs = {
  redis: {
    name: 'Redis',
    label: 'redis/redis-stack7.2.0',
    search: true,
    config: {
      REDIS_DATABASE: 0,
      REDIS_HOST: USE_REDIS && 'redis' || undefined,
      REDIS_PORT: 6379,
      REDIS_USERNAME: '',
      REDIS_PASSWORD: 'key_admin',
      REDIS_USE_TLS: false,
    }
  },
};

export const entities = {
  'fuzzy-task': {
    name: 'task',
    label: 'Task',
    schema: FuzzyTaskSchema,
    class: Task,
  },
};

export const namespaces: Namespaces = {
  fuzzy: {
    name: 'Fuzzy',
    type: 'fuzzy',
    label: 'Fuzzy Playground',
    entities: [
      entities['fuzzy-task'],
    ],
  },
};

//associate each profile (database) with one or more namespaces
//HotMesh will automatically install the app to the location
//if it does not exist upon connecting
export const profiles: Profiles = {
  redis: {
    db: dbs.redis,
    namespaces: {
      fuzzy: namespaces.fuzzy,
    }
  },
};

/**
 * Initialize each profile (p) with a db that is properly configured,
 * with a valid (non-empty) 'REDIS_HOST' property. For each db, the set of namespaces
 * declared in the profile will be initialized
 * 
 * @param p - the profiles to initialize
 */
export const init = async (p = profiles) => {
  for(let key in p) {
    const profile = p[key];
    if (profile.db.config.REDIS_HOST) {
      console.log(`!!Initializing ${profile.db.name} [${key}]...`);
      profile.instances = {};
      for(let ns in profile.namespaces) {
        const namespace = profile.namespaces[ns];
        console.log(`  - ${ns}: ${namespace.label}`);
        let pinstances = profile.instances[ns];
        if (!pinstances) {
          pinstances = {};
          profile.instances[ns] = pinstances;
        }
        for(let entity of namespace.entities) {
          console.log(`    - ${entity.name}: ${entity.label}`);
          const instance = pinstances[entity.name] = new entity.class(ns, namespace.type, profile.db.config);
          await instance.init(profile.db.search);
        }
      }
    }
  }
};

/**
 * Find the entity class instance by database, namespace, and entity name. The database
 * is required, but the namespace and entity name are optional, depending on the use case.
 * 
 * @param {string} database - For example, 'redis'
 * @param {string} namespace - For example, 'fuzzy' for 'inventory'
 * @param {string} entity - For example, 'order'
 * @returns {EntityInstanceTypes | undefined}
 */
export const findEntity = (database: string, namespace: string, entity: string): EntityInstanceTypes | undefined => {
  if (!database || !profiles[database] || !profiles[database]?.db?.config?.REDIS_HOST) {
    const activeProfiles = Object.keys(profiles).filter((key) => profiles[key]?.db?.config?.REDIS_HOST);
    throw new Error(`The database query parameter [${database}] was not found. Use one of: ${activeProfiles.join(', ')}`);
  }

  if (!namespace || !profiles[database]?.instances?.[namespace]) {
    const activeNamespaces = Object.keys(profiles[database]?.instances ?? {});
    throw new Error(`The namespace query parameter [${namespace}] was not found. Use one of: ${activeNamespaces.join(', ')}`);
  }

  const entities = profiles[database]?.instances?.[namespace] ?? {};
  if (!entity || entity?.startsWith('-') || entity === '*') {
    entity = Object.keys(entities)[0];
  } else if (entity?.endsWith('*')) {
    entity = entity.slice(0, -1);
  }

  const target = profiles[database]?.instances?.[namespace]?.[entity] as EntityInstanceTypes | undefined;
  if (!target) {
    console.error(`Entity not found: ${database}.${namespace}.${entity}`);
    entity = Object.keys(entities)[0];
    return profiles[database]?.instances?.[namespace]?.[entity] as EntityInstanceTypes | undefined;
  }
  return target;
};

export const findSchemas = (database: string, ns: string): Record<string, Types.WorkflowSearchSchema> => {
  if (!database || !profiles[database] || !profiles[database]?.db?.config?.REDIS_HOST) {
    const activeProfiles = Object.keys(profiles).filter((key) => profiles[key]?.db?.config?.REDIS_HOST);
    throw new Error(`The database query parameter [${database}] was not found. Use one of: ${activeProfiles.join(', ')}`);
  }
  const profile = profiles[database];
  const namespacedInstance = profile.instances[ns];
  const schemas: Record<string, Types.WorkflowSearchSchema> = {};
  for(let entityName in namespacedInstance) {
    const entityInstance = namespacedInstance[entityName];
    const opts = entityInstance.getSearchOptions();
    schemas[opts.index ?? entityName] = opts.schema;
  }
  return schemas;
}

/**
 * Safely serialize the manifest for transmission to the client.
 */
export const toJSON = (p: Profiles = profiles): any => {
  const result: any = {};
  for(let key in p) {
    const profile = p[key];
    if (!profile.db.config.REDIS_HOST) {
      continue;
    } else {
      result[key] = {
        db: { ...profile.db, config: undefined },
        namespaces: {},
      };
    }
    for(let ns in profile.namespaces) {
      const namespace = profile.namespaces[ns];
      result[key].namespaces[ns] = {
        name: namespace.name,
        label: namespace.label,
        entities: [],
      };
      for(let entity of namespace.entities) {
        result[key].namespaces[ns].entities.push({
          name: entity.name,
          label: entity.label,
          schema: entity.schema,
        });
      }
    }
  }
  return result;
};
