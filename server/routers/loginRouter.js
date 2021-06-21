const Router = require('@koa/router');
const { loginHandle, loginRefreshHandle, refreshJWT } = require('../controllers/login');

const loginRoute = new Router({
  prefix: '/login',
});

loginRoute.post('/', async (ctx, next) => {
  let body = ctx.request.body;
  let { account, password } = body;
  const result = await loginHandle(account, password);
  if (result) {
    ctx.body = JSON.stringify({
      loginStatus: true,
      ...result,
    });
  } else {
    ctx.body = JSON.stringify({
      loginStatus: false,
    });
  }
  await next();
});
// 验证自动登录token
loginRoute.get('/', async (ctx, next) => {
  const token = ctx.header.authorization;
  try {
    const result = await loginRefreshHandle(token);
    ctx.body = JSON.stringify(result);
    await next();
  } catch (err) {
    ctx.status = 401;
    if (err === 'token无效') {
      ctx.body = 1;
    } else {
      ctx.body = 2;
    }
  }
});
// 刷新jwt
loginRoute.get('/refresh', async (ctx, next) => {
  const { account } = ctx.request.query;
  const token = refreshJWT(account);
  ctx.body = token;
  next();
});
module.exports = loginRoute;
