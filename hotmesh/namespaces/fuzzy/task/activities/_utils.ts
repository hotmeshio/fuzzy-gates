import { StringStringType } from "@hotmeshio/hotmesh/build/types";
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

export const mapLeafTasks = (tasks: RawTask[], targetId?: string) => {
  return tasks.filter(step => step._instructions)
    .filter(step => !targetId || step.$.endsWith(targetId))
    .map(step => {
      //pipes elicit a sense of 'treeness' better than other delimiters
      const preText = repeatString('|', step._depth?.split('.').length - 1);
      return `${preText}${step._depth}. ${guidToParts(step.$)[1]} ${flattenText(step._instructions)}`;
    })
    .join(' ');
}

/**
 * Finds the target task by ID, assembles the ancestor task list, and identifies prior and following sibling tasks.
 * @param tasks Array of RawTask objects sorted by depth.
 * @param targetId The ID of the target task to find.
 * @returns An object containing the ancestor task list, prior sibling, and following sibling tasks.
 */
export const findTaskDetails = (tasks: RawTask[], targetId: string): {ancestorTasks: string[], targetTask: StringStringType, priorSibling: string, followingSibling: string} => {
  // Find the target task by its ID
  const targetTask = tasks.find(task => task.$.endsWith(targetId));
  if (!targetTask) {
    throw new Error('Target task not found');
  }

  const targetDepth = targetTask._depth.split('.');
  const targetDepthLength = targetDepth.length;

  // Assemble the ancestor task list
  const ancestorTasks: string[] = [];
  let priorSibling: string | null = null;
  let followingSibling: string | null = null;

  // Iterate over tasks to build the ancestor list and find siblings
  for (let i = 0; i < tasks.length; i++) {
    const currentTask = tasks[i];
    const currentDepth = currentTask._depth.split('.');

    // Check if the current task is an ancestor
    if (currentDepth.length < targetDepthLength && targetDepth.slice(0, currentDepth.length).join('.') === currentDepth.join('.')) {
      ancestorTasks.push(currentTask._task);
    }

    // Check if the current task is a sibling of the target task
    if (
      currentDepth.length === targetDepthLength &&
      currentDepth.slice(0, -1).join('.') === targetDepth.slice(0, -1).join('.')
    ) {
      const currentDepthLast = parseInt(currentDepth[currentDepth.length - 1], 10);
      const targetDepthLast = parseInt(targetDepth[targetDepth.length - 1], 10);

      // Identify the prior and following siblings
      if (currentDepthLast === targetDepthLast - 1) {
        priorSibling = currentTask._task;
      } else if (currentDepthLast === targetDepthLast + 1 && !followingSibling) {
        followingSibling = currentTask._task;
      }
    }
  }

  return {
    ancestorTasks,
    targetTask,
    priorSibling,
    followingSibling
  };
};

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
    '4',
    '_depth',
    '_task',
    '_instructions',
    '_context',
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
    '6',
    '_depth',
    '_task',
    '_instructions',
    '_inputs',
    '_outputs',
    '_result',
  ) as [number, ...Array<string | string[]>];
  return arrayToHash(results) as RawTask[];
}

/**
 * Returns the origin task with additional context.
 */
export const findOrigin = async (originId: string, config: {database: string, namespace: string}): Promise<RawTask> => {
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
  return items[0];
}

/**
 * The LLM can get confused about what constitutes an ID, so this refines the LLM response,
 * so downstream methods can expect a valid record ID. 
 */
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
  if (task._result?.length) {
    markdown += `${transformResultToMarkdown(task._result)}\n`;
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

const transformResultToMarkdown = (result: string): string => {
  // Use replace to insert a unique marker after the targeted commas, then split by that marker.
  const regex = /,(?=\S)/g;
  const marker = '__,__'; // Unique marker to split on after replacement
  const modifiedResult = result.replace(regex, ',' + marker);
  const items = modifiedResult.split(marker);
  
  // Join the items with markdown list formatting
  const parsedOutput: string = items.length > 1 ? `- ${items.join('\n- ')}\n` : result;
  return `**Result**\n\n${parsedOutput}\n`;
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
