const Router = require('@koa/router');
const loginRouter = require('./loginRouter');
const signupRoute = require('./registerRoute');
const friendRoute = require('./friendhip');
const mainRouter = new Router();
mainRouter.use(loginRouter.routes())
  .use(signupRoute.routes())
  .use(friendRoute.routes());
module.exports = mainRouter;
