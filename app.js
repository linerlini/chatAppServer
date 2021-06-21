const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const { Server } = require('socket.io');
const http = require('http');
const mainRouter = require('./server/routers/index');
const { verifyMiddleware } = require('./server/middleware/verify');
const { verify } = require('./server/utils/jwt');
const initSocketConnect = require('./server/controllers/initSocketConnect');

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

const httpServer = http.createServer(app.callback());
// socket.io初始化
const socketOptions = {
  path: '/chat',
  cors: {
    origin: '*',
  },
};
const io = new Server(httpServer, socketOptions);
io.use((socket, next) => {
  const { token } = socket.handshake.auth;
  verify(token)
    .then((res) => {
      socket.data.account = res.data;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});
global.io = io;
// socket.io添加事件以及处理
io.on('connection', initSocketConnect);

httpServer.listen(5001, () => {
  console.log('server listen 5001');
});
