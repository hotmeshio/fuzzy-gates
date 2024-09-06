import { Router } from 'express';
import { findEntity } from '../../hotmesh/manifest';
import { Task } from '../../hotmesh/namespaces/fuzzy/task';
import { ExportFormat, TaskInput, TaskInstruction } from '../../types/task';
import { HotMesh } from '@hotmeshio/hotmesh';

const router = Router();

// Fetch search spec
router.get('/schema', async (req, res) => {
  try {
    const query = req.query as {database: string, namespace: string};
    const task = findEntity(query.database, query.namespace, 'task')as Task;
    res.json(task.getSearchOptions());
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Add a new task
router.post('/', async (req, res) => {
  try {
    const query = req.query as {database: string, namespace: string};
    const task = findEntity(query.database, query.namespace, 'task')as Task;
    let body = req.body as TaskInstruction;
    let payload: TaskInput = {
      origin: HotMesh.guid().replace(/-/g, ''),
      context: body.context,
      global: body.instructions,
      current: body.instructions,
      depth: '1',
    };
    res.json(await task.create(payload));
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Prune an existing task/journey/itinerary
router.post('/:id/prune', async (req, res) => {
  try {
    const query = req.query as {database: string, namespace: string};
    const task = findEntity(query.database, query.namespace, 'task')as Task;
    res.json(await task.prune(req.params.id, { database: query.database, namespace: query.namespace }));
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Restore a pruned task/journey/itinerary
router.post('/:id/restore', async (req, res) => {
  try {
    const query = req.query as {database: string, namespace: string};
    const task = findEntity(query.database, query.namespace, 'task')as Task;
    res.json(await task.restore(req.params.id, { database: query.database, namespace: query.namespace }));
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Clarify leaf task instructions
router.post('/:id/clarify', async (req, res) => {
  try {
    const query = req.query as {database: string, namespace: string};
    const task = findEntity(query.database, query.namespace, 'task')as Task;
    res.json(await task.clarify(req.params.id, { database: query.database, namespace: query.namespace }));
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Expand leaf tasks into branches with subtask leaves
router.post('/:id/expand', async (req, res) => {
  try {
    const query = req.query as {database: string, namespace: string};
    const task = findEntity(query.database, query.namespace, 'task') as Task;
    const payload = req.body as { target?: string };
    res.json(await task.expand(req.params.id, payload.target, { database: query.database, namespace: query.namespace }));
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Export the task tree as `markdown` or `html`
router.get('/:id/export', async (req, res) => {
  try {
    const query = req.query as { database: string, namespace: string, format?: ExportFormat };
    const task = findEntity(query.database, query.namespace, 'task') as Task;
    
    const exportedData = await task.export(req.params.id, query.format, { database: query.database, namespace: query.namespace });

    // Determine the response content type based on the 'format' query parameter
    switch (query.format) {
      case 'html':
        res.type('text/html');
        break;
      case 'markdown':
        res.type('text/plain');
        break;
      default:
        res.type('text/plain');
        break;
    }

    res.send(exportedData);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Fetch all tasks (pagination)
router.get('/', async (req, res) => {
  try {
    const query = req.query as {database: string, namespace: string};
    const task = findEntity(query.database, query.namespace, 'task')as Task;
    res.status(200).send(await task.find([], 0, 100));
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Fetch a task
router.get('/:taskId', async (req, res) => {
  try {
    const query = req.query as {database: string, namespace: string};
    const task = findEntity(query.database, query.namespace, 'task')as Task;
    const { taskId } = req.params;
    res.status(200).send(await task.retrieve(taskId));
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Delete a task
router.delete('/:taskId', async (req, res) => {
  try {
    const query = req.query as {database: string, namespace: string};
    const task = findEntity(query.database, query.namespace, 'task')as Task;
    const { taskId } = req.params;
    await task.delete(taskId);
    res.json({ status: 'success' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Aggregate tasks
router.post('/aggregate', async (req, res) => {
  try {
    const query = req.query as {database: string, namespace: string};
    const task = findEntity(query.database, query.namespace, 'task')as Task;
    res.json(await task.aggregate(req.body.filter, req.body.apply, req.body.rows, req.body.columns, req.body.reduce, req.body.sort, req.body.start, req.body.size));
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

export { router };
