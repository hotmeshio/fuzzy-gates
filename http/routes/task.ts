import { MeshOS } from '@hotmeshio/hotmesh';

import { Router } from 'express';
import { marked } from 'marked';
import { Task } from '../../hotmesh/task';
import { ExportFormat, TaskAPIConfig, TaskInput, TaskInstruction } from '../../types/task';
import { HotMesh } from '@hotmeshio/hotmesh';
import { Socket } from '../utils/socket';
import { styles } from '../utils/styles';

const router = Router();

// Fetch search spec
router.get('/schema', async (req, res) => {
  try {
    const query = req.query as {database: string, namespace: string};
    const task = MeshOS.findEntity(query.database, query.namespace, 'task')as Task;
    res.json(task.getSearchOptions());
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

//standard CRUD operation (PATCH)
router.patch('/:id', async (req, res) => {
  try {
    const query = req.query as {database: string, namespace: string};
    const task = MeshOS.findEntity(query.database, query.namespace, 'task')as Task;
    const payload = req.body as Record<string, any>;
    res.json(await task.update(req.params.id, payload));

    Socket.broadcast('mesh.planes.control', {
      data: { method: 'patch', id: req.params.id },
      metadata: {
        timestamp: Date.now(),
        statusCode: 200,
        status: 'success'
      }
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Add a new task
router.post('/', async (req, res) => {
  try {
    const query = req.query as {database: string, namespace: string};
    const task = MeshOS.findEntity(query.database, query.namespace, 'task')as Task;
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
    const task = MeshOS.findEntity(query.database, query.namespace, 'task')as Task;
    res.json(await task.prune(req.params.id, { database: query.database, namespace: query.namespace }));
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Restore a pruned task/journey/itinerary
router.post('/:id/restore', async (req, res) => {
  try {
    const query = req.query as {database: string, namespace: string};
    const task = MeshOS.findEntity(query.database, query.namespace, 'task')as Task;
    res.json(await task.restore(req.params.id, { database: query.database, namespace: query.namespace }));
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Clarify leaf task instructions
router.post('/:id/clarify', async (req, res) => {
  try {
    const query = req.query as {database: string, namespace: string};
    const task = MeshOS.findEntity(query.database, query.namespace, 'task')as Task;
    const payload = req.body as TaskAPIConfig;
    const hookPayload = await task.clarify(req.params.id, payload.target, { database: query.database, namespace: query.namespace, context: payload.context });
    res.json(hookPayload);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Execute leaf task instructions
router.post('/:id/execute', async (req, res) => {
  try {
    const query = req.query as {database: string, namespace: string};
    const task = MeshOS.findEntity(query.database, query.namespace, 'task')as Task;
    const payload = req.body as TaskAPIConfig;
    res.json(await task.execute(req.params.id, payload.target, { database: query.database, namespace: query.namespace, model: payload.model, context: payload.context }));
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Expand leaf tasks into branches with subtask leaves
router.post('/:id/expand', async (req, res) => {
  try {
    const query = req.query as {database: string, namespace: string};
    const task = MeshOS.findEntity(query.database, query.namespace, 'task') as Task;
    const payload = req.body as TaskAPIConfig;
    res.json(await task.expand(req.params.id, payload.target, { database: query.database, namespace: query.namespace, model: payload.model, context: payload.context }));
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Export the task tree as `markdown` or `html`
router.get('/:id/export', async (req, res) => {
  try {
    const query = req.query as { database: string, namespace: string, format?: ExportFormat };
    const task = MeshOS.findEntity(query.database, query.namespace, 'task') as Task;
    
    let exportedData = await task.export(req.params.id, 'markdown', { database: query.database, namespace: query.namespace });

    // Determine the response content type based on the 'format' query parameter
    switch (query.format) {
      case 'html':
        res.type('text/html');
        const markup = await marked(exportedData);
        exportedData = `<html><head><title>Task Tree</title>${styles}</head><body>${markup}</body></html>`;
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
    const task = MeshOS.findEntity(query.database, query.namespace, 'task')as Task;
    res.status(200).send(await task.find([], 0, 100));
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Fetch a task
router.get('/:taskId', async (req, res) => {
  try {
    const query = req.query as {database: string, namespace: string};
    const task = MeshOS.findEntity(query.database, query.namespace, 'task')as Task;
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
    const task = MeshOS.findEntity(query.database, query.namespace, 'task')as Task;
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
    const task = MeshOS.findEntity(query.database, query.namespace, 'task')as Task;
    res.json(await task.aggregate(req.body.filter, req.body.apply, req.body.rows, req.body.columns, req.body.reduce, req.body.sort, req.body.start, req.body.size));
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

export { router };
