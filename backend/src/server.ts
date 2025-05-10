import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import {AppFlags, FlagDescription, PublishEvents} from './interfaces.js';
import cors from "cors";
import {MongoRepo} from './mongo.js';
import {$AppFlags} from './constants.js';

(async () => {
  await MongoRepo.connect()
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }
  });
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }))
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  io.on("connection", (socket) => {
    console.log('a user connected');
    // broadcast to all connected clients in the room
    socket.on(PublishEvents.FLAG, (event, callback) => {
      console.log({
        location: 'server',
        message: event,
      });
      socket.emit(PublishEvents.FLAG, event);
      callback({
        status: 'ok'
      });
    })
  });

  io.on("connection_error", (err) => {
    console.log(err.req);      // the request object
    console.log(err.code);     // the error code, for example 1
    console.log(err.message);  // the error message, for example "Session ID unknown"
    console.log(err.context);  // some additional error context
  });

  app.get('/flags/:appName', async (req, res) => {
    const request = req.params.appName;
    if (!request) {
      /**
       * send bad request status
       */
      res.status(400).json({
        status: 'error',
        message: 'appName is required'
      });
    } else {
      console.log({query: {appName: request}})
      const flags = await MongoRepo.instance.collection<AppFlags>($AppFlags).findOne({appName: request});
      res.json(flags);
    }
  });

  app.post('/flags/create', async (req, res) => {
    const request = req.body as FlagDescription;
    if (!request) {
      /**
       * send bad request status
       */
      res.status(400).json({
        status: 'error',
        message: 'request is required'
      });
    } else {
      console.log({request});
      const flag = await MongoRepo.instance.collection<FlagDescription>($AppFlags).insertOne(request);
      res.status(200).json({success: true, flag});
    }
  })

  httpServer.listen(3000, () => {
    console.log('listening on *:3000');
  })

})().catch((err) => {
  console.log('app startup', err);
});
