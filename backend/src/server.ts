import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import {AppFlags, CreateFlagRequest, PublishEvents} from './interfaces.js';
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
      allowedHeaders: ['Content-Type', 'Authorization', 'apollo-require-preflight', 'x-apollo-operation-name']
    }
  });
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'apollo-require-preflight', 'x-apollo-operation-name'],
  }))
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  io.on("connection", (socket) => {
    console.log({location: 'server', message: 'a user connected', origin: socket.request.headers.origin});
    // broadcast to all connected clients in the room
    socket.on(PublishEvents.FLAG, (event, callback) => {
      console.log({
        location: 'server.connection',
        message: event,
      });
      socket.emit(PublishEvents.FLAG, event);
      callback({
        status: 'ok'
      });
    })
  });

  io.on("connection_error", (err) => {
    console.log({
      location: 'server.connection',
      request: err.req,
      code: err.code,
      message: err.message,
      context: err.context
    });
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
      console.log({location: 'server.flags.get', query: {appName: request}})
      const flags = await MongoRepo.instance.collection<AppFlags>($AppFlags).findOne({appName: request});
      res.json(flags);
    }
  });

  app.post('/app/create', async (req, res) => {
    const request = req.body as CreateFlagRequest;
    if (!request) {
      /**
       * send bad request status
       */
      res.status(400).json({
        status: 'error',
        message: 'request is required'
      });
    } else {
      const existingFlags = await MongoRepo.instance.collection<AppFlags>($AppFlags).findOne({appName: request.appName});
      if (!existingFlags) {
        const newFlag: AppFlags = {
          appName: request.appName,
          flags: [{
            name: request.name,
            enabled: false
          }]
        }
        console.log({location: 'server.app.create', message: 'Creating new app', newFlag});
        const response = await MongoRepo.instance.collection<AppFlags>($AppFlags).insertOne(newFlag);
        if (response.acknowledged && response.insertedId) {
          res.status(200).json({success: true, results: {message: 'app created'}, __typename: 'InsertOne'});
        } else {
          res.status(200).json({success: false, results: {message: 'app not created', __typename: 'InsertOne'}});
        }
      } else {
        console.warn({location: 'server.app.create', message: 'App already exists', existingFlags});
        res.status(200).json({success: false, results: {message: 'app already exists', __typename: 'InsertOne'}});
      }
    }
  })

  app.post('/flags/create', async (req, res) => {
    const request = req.body as CreateFlagRequest;
    if (!request) {
      /**
       * send bad request status
       */
      res.status(400).json({
        status: 'error',
        message: 'request is required'
      });
    } else {
      const existingFlags = await MongoRepo.instance.collection<AppFlags>($AppFlags).findOne({appName: request});
      if (!existingFlags) {
        console.warn({location: 'server.flags.create', message: 'App does not exist', existingFlags});
        res.status(200).json({success: false, results: {message: 'app does not exist'}, __typename: 'UpdateOne'});
      } else {
        console.log({location: 'server.flags.create', message: 'Creating new flag', existingFlags});
        const response = await MongoRepo.instance.collection<AppFlags>($AppFlags).updateOne(
          {appName: request.appName},
          {
            $addToSet: {
              flags: {
                name: request.name,
                enabled: false
              }
            }
          }
        );
        if (response.acknowledged && response.modifiedCount) {
          res.status(200).json({success: true, results: {message: 'flag created'}, __typename: 'UpdateOne'});
        } else {
          res.status(200).json({success: false, results: {message: 'flag not created'}, __typename: 'UpdateOne'});
        }
      }
    }
  })

  httpServer.listen(3000, () => {
    console.log({location: 'server.listen', message: 'listening on *:3000'});
  })

})().catch((err) => {
  console.log('app startup', err);
});
