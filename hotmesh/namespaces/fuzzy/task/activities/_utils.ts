import { arrayToHash, repeatString } from "../../../../../modules/utils";
import { ExportFormat, PruneTarget, RawTask, TaskExport } from "../../../../../types/task";
import { findEntity } from "../../../../manifest";

export const guidToParts = (guid: string): [string, string] => {
  const [_hm, _ns, _j, ...rest] = guid.split(':');
  const [entity, ...id] = rest.join(':').split('-');
  return [entity, id.join('-')];
}

const flattenText = (text: string) => {
  return text.replace(/\n/g, '');
}

export const mapLeafTasks = (tasks: RawTask[]) => {
  return tasks.filter(step => step._instructions)
    .map(step => {
      //pipes elicit a sense of 'treeness' better than other delimiters
      const preText = repeatString('|', step._depth?.split('.').length - 1);
      return `${preText}${step._depth}. ${guidToParts(step.$)[1]} ${flattenText(step._instructions)}`;
    })
    .join(' ');
}

/**
 * Finds active/inactive/all tasks for a given task tree origin guid, given
 * optional prune target.
 */
export const findTasks = async (originId: string, config: {database: string, namespace: string}, pruneTarget: PruneTarget = 'y'): Promise<RawTask[]> => {
  const task = findEntity(config.database, config.namespace, 'task');
  const results = await task.meshData.find(
    'task',
    { namespace: config.namespace },
    'FT.SEARCH',
    'fuzzy-task',
    `@_origin:{${originId.substring(5).replace(/([-\.])/g, '\\$1')}} @_active:{${pruneTarget}}`,
    'SORTBY',
    '_depth',
    'ASC',
    'LIMIT',
    '0',
    '100',
    'RETURN',
    '3',
    '_depth',
    '_task',
    '_instructions',
  ) as [number, ...Array<string | string[]>];
  return arrayToHash(results) as RawTask[];
}

/**
 * Finds active/inactive/all tasks for a given task tree origin guid, given
 * optional prune target.
 */
export const findExportableTasks = async (originId: string, config: {database: string, namespace: string}): Promise<RawTask[]> => {
  const task = findEntity(config.database, config.namespace, 'task');
  const results = await task.meshData.find(
    'task',
    { namespace: config.namespace },
    'FT.SEARCH',
    'fuzzy-task',
    `@_origin:{${originId.substring(5).replace(/([-\.])/g, '\\$1')}} @_active:{y}`,
    'SORTBY',
    '_depth',
    'ASC',
    'LIMIT',
    '0',
    '100',
    'RETURN',
    '5',
    '_depth',
    '_task',
    '_instructions',
    '_inputs',
    '_outputs',
  ) as [number, ...Array<string | string[]>];
  return arrayToHash(results) as RawTask[];
}

/**
 * Returns the origin task with additional context.
 */
export const findOrigin = async (originId: string, config: {database: string, namespace: string}): Promise<RawTask> => {
  console.log('findOrigin', originId, config, `@_origin:{${originId.substring(5).replace(/([-\.])/g, '\\$1')}} @_depth:{1}`);
  const task = findEntity(config.database, config.namespace, 'task');
  const results = await task.meshData.find(
    'task',
    { namespace: config.namespace },
    'FT.SEARCH',
    'fuzzy-task',
    `@_origin:{${originId.substring(5).replace(/([-\.])/g, '\\$1')}}`,
    'SORTBY',
    '_depth',
    'ASC',
    'LIMIT',
    '0',
    '1',
    'RETURN',
    '6',
    '_task',
    '_instructions',
    '_context',
    '_active',
    '_origin',
    '_parent',
  ) as [number, ...Array<string | string[]>];
  const items = arrayToHash(results) as RawTask[];
  console.log(items);
  return items[0];
}

export const resolveId = (id: string, dbTasks: RawTask[], removeType = false) => {
  if (!id) return '';
  if (id.includes(':')) {
    const [_hm, _ns, _j, ...rest] = id.split(':');
    if (!removeType) return rest.join(':');
    const [_entity, ...guid] = rest.join(':').split('-');
    return guid.join('-');
  } else if (id.startsWith('1.') && id.includes(' ')) {
    return id.split(' ')[1];
  } else if (id.startsWith('1.')) {
    if (id.endsWith('.')) id = id.slice(0, -1);
    return resolveId(dbTasks.find(task => task._depth === id)?.$ ?? '', dbTasks, removeType);
  } else if (id.includes('-') && removeType) {
    const [_entity, ...guid] = id.split('-');
    return guid.join('-');
  }
  return id;
}

export const findAncestors = (id: string, dbTasks: RawTask[]) => {
  const task = dbTasks.find(task => task.$.endsWith(id));
  if (!task) return [];
  const ancestors = [];
  let current = task;
  while (current?._depth.split('.').length > 1) {
    const parentDepth = current._depth.split('.').slice(0, -1).join('.');
    current = dbTasks.find(task => task._depth === parentDepth);
    ancestors.unshift(current);
  }
  return ancestors;
}

export const findAncestorTasks = (id: string, dbTasks: RawTask[]) => {
  return findAncestors(id, dbTasks).map(task => task._task);
}

export const findDBTask = (id: string, dbTasks: RawTask[]) => {
  return dbTasks.find(task => task.$.endsWith(id));
}

export const exportTasks = async (id: string, format: ExportFormat, config: { namespace: string, database: string }): Promise<string> => {
  const tasks = await findExportableTasks(id, config) as TaskExport[];
  const defaultTitle = 'Automated Transitive Task Tree';
  let output = `# ${defaultTitle}\n\n`;

  tasks.forEach((task, index) => {
    output += renderTaskAsMarkdown(task);
  });
  return output;
}

const renderTaskAsMarkdown = (task: TaskExport): string => {
  const level = task._depth.split('.').length + 1;
  const headingLevel = Math.min(level, 6); // Limit heading level to h6
  const taskTitle = `${task._depth} ${task._task}`;
  const heading = `${'#'.repeat(headingLevel)} ${taskTitle}\n\n`;

  let markdown = heading;
  if (task._instructions) {
    markdown += `${transformInstructionsToMarkdown(task._instructions)}\n`;
  }
  if (task._inputs?.length) {
    markdown += `${formatIngredientsAsMarkdown(task._inputs, 'Inputs')}\n`;
  }
  if (task._outputs?.length) {
    markdown += `${formatIngredientsAsMarkdown(task._outputs, 'Outputs')}\n`;
  }
  return markdown;
}

const transformInstructionsToMarkdown = (instructions: string): string => {
  const lines = instructions.split('\n');
  let markdown = '';

  lines.forEach(line => {
    if (line.match(/^\d+\./)) { // Numbered list
      const listItem = line.replace(/^\d+\.\s*/, '');
      markdown += `- ${listItem}\n`;
    } else if (line.match(/^```/)) { // Code block
      if (markdown.endsWith('```\n')) {
        markdown += '\n'; // End the code block
      } else {
        markdown += '```\n'; // Start a new code block
      }
    } else {
      markdown += `${line}\n`;
    }
  });

  return markdown;
}

const formatIngredientsAsMarkdown = (json: string, title: string): string => {
  const inputs = JSON.parse(json);
  if (!inputs.length) return '';
  let markdown = `**${title}**\n`;
  inputs.forEach((input: { item: string, quantity: number, unit: string }) => {
    markdown += `- ${input.quantity} ${input.unit} of ${input.item}\n`;
  });
  return markdown;
}
