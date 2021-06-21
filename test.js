const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const { Server } = require('socket.io');
const http = require('http');

const app = new Koa();
const httpServer = http.createServer(app.callback());
app.use(cors());
const io = new Server(httpServer);
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
httpServer.listen(6000, () => {
  console.log('connect successful');
});
