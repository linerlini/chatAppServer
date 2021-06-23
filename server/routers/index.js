const Router = require('@koa/router');
const loginRouter = require('./loginRouter');
const signupRoute = require('./registerRoute');
const friendRoute = require('./friendhip');
const chatRoute = require('./chatRouter');

const mainRouter = new Router();
mainRouter.use(loginRouter.routes())
  .use(signupRoute.routes())
  .use(friendRoute.routes())
  .use(chatRoute.routes());
module.exports = mainRouter;
