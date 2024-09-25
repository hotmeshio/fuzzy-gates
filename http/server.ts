import 'dotenv/config';
import config from '../config';
import { MeshData } from '@hotmeshio/hotmesh';
import path from 'path';
import express, { NextFunction, Request, Response } from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';

import { setupTelemetry, shutdownTelemetry } from '../lib/tracer';
import { init as initHotMesh } from '../hotmesh/manifest';
import { router as hotMeshRouter } from './routes/hotmesh';
import { router as taskRouter } from './routes/task';
import { configureLogger } from './utils/logger';
import { Socket } from './utils/socket';

const app = express();
const logger = configureLogger(app);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Generic Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

const corsOptions = {
  origin: config.CORS_ORIGIN,
  credentials: true, // sessions/cookie auth
};
app.use(cors(corsOptions));

async function initialize() {
  //start persistent services
  setupTelemetry();
  await initHotMesh();
  const httpServer = createServer(app);
  app.use(express.json());

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "http://localhost:3000", // Ensure this matches your front-end URL, adjust as needed
      methods: ["GET", "POST"], // Allowed request methods
      credentials: true
    }
  });
  Socket.bindServer(io);


  // API routes
  app.use('/api/v1/tasks', taskRouter);       //REST style API
  app.use('/api/v1/meshdata', hotMeshRouter); //RPC style API

  // Static React Webapp serving
  app.use(express.static(path.join(__dirname, '../node_modules/@hotmeshio/dashboard/build')));
  app.get('/*', (req, res) => {
      res.sendFile(path.join(__dirname, '../node_modules/@hotmeshio/dashboard/build', 'index.html'));
  });

  // Start HTTP server
  const PORT = process.env.PORT || 3010;
  httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

initialize().catch(error => {
  console.error('Failed to initialize the application:', error);
  process.exit(1);
});

async function shutdown() {
  await MeshData.shutdown();
  await shutdownTelemetry();
  process.exit(0);
}

// Quit / ctrl-c
process.on('SIGINT', async function onSigint() {
  console.log('Got SIGINT (aka ctrl-c in docker). Graceful shutdown', { loggedAt: new Date().toISOString() });
  await shutdown();
});

// Quit / docker
process.on('SIGTERM', async function onSigterm() {
  console.log('Got SIGTERM (docker container stop). Graceful shutdown', { loggedAt: new Date().toISOString() });
  await shutdown();
});
