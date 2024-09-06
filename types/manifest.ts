import { Types } from '@hotmeshio/hotmesh';

import { Task } from '../hotmesh/namespaces/fuzzy/task';

export type DBConfig = {
  REDIS_DATABASE: number,
  REDIS_HOST: string | undefined,
  REDIS_PORT: number,
  REDIS_USERNAME: string,
  REDIS_PASSWORD: string,
  REDIS_USE_TLS: boolean,
};

export type DB = {
  name: string,
  label: string,
  search: boolean,
  config: DBConfig,
};

export type EntityClassTypes = typeof Task;
export type EntityInstanceTypes = Task;

export type Entity = {
  name: string,
  label: string,
  schema: Types.WorkflowSearchSchema,
  class: EntityClassTypes,
};

export type Namespace = {
  name: string,
  type: string,
  label: string,
  entities: Entity[],
};

export type Namespaces = {
  [key: string]: Namespace
};

export type Instance = {
  [key/*entity name*/: string]: EntityInstanceTypes,
};

export type Instances = {
  [key/*namespace abbreviation*/: string]: Instance,
};

export type Profile = {
  db: DB,
  namespaces: Namespaces,
  instances?: Instances,
};

export type Profiles = {
  [key: string]: Profile
};
