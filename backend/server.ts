import express from 'express';
import {createServer} from 'node:http';
import {Server} from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server();

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});