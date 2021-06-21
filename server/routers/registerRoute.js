const Router = require('@koa/router');
const registerHandle = require('../controllers/register');

const signupRoute = new Router({
  prefix: '/register',
});

signupRoute.post('/', async (ctx, next) => {
  const result = await registerHandle(ctx.request.body);
  if (!result) {
    ctx.body = {
      registerStatus: false,
    };
  } else {
    ctx.body = {
      registerStatus: true,
      ...result,
    };
  }
  await next();
});

module.exports = signupRoute;
