const jwt = require('../utils/jwt');

module.exports.verifyMiddleware = function verify(exclude) {
  return async (ctx, next) => {
    const { path } = ctx.request;
    let flag = false;
    flag = exclude.some((item) => {
      return path.startsWith(item);
    })
    if (flag) {
      await next();
    } else {
      const token = ctx.header.authorization;
      try {
        const result = await jwt.verify(token);
        await next();
      } catch (err) {
        ctx.status = 401;
        if (err === jwt.TOKEN_INVALID) {
          ctx.message = 'token err';
        } else if (err === jwt.TOKEN_TIMEOU) {
          ctx.message = 'token timeout';
        } else {
          ctx.message = 'token err';
        }
      }
    }
  }
}
