const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const http = require('http');
const WebSocket = require('ws');
const mainRouter = require('./server/routers/index');
const { verifyMiddleware } = require('./server/middleware/verify');

// koa主要的
const app = new Koa();
app.use(cors());
app.use(koaBody({
  multipart: true,
  enableTypes: ['json', 'form', 'text'],
}));
app.use(verifyMiddleware(['/login', '/register']));
app.use(mainRouter.routes());
app.use(mainRouter.allowedMethods());
// http服务器
const httpServer = http.createServer(app.callback());
// websocket服务器
const socketServer = new WebSocket.Server({
  server: httpServer,
  path: '/chat',
  verifyClient: ({req}) => {
    console.log(req);
  },
});
socketServer.on('connection', (socket) => {
  socket.on('message', (message) => {
    console.log('receive message', message);
  });
  socket.send('hello client');
})

httpServer.listen(5001, () => {
  console.log('server listen 5001');
});
