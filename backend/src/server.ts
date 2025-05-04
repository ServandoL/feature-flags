import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import {PublishEvents} from './interfaces.js';
import cors from "cors";

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

app.get('/flags/all', async (req, res) => {

})

httpServer.listen(3000, () => {
  console.log('listening on *:3000');
})
