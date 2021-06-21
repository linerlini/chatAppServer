const Router = require('@koa/router');
const { addFriend, acceptOrReject } = require('../controllers/friendship');
const { User } = require('../../dataBaseInit/modules/users');
const friendRelationshipRoute = new Router({
  prefix: '/friendship',
});

friendRelationshipRoute.post('/apply', async (ctx, next) => {
  const result = await addFriend(ctx.request.body);
  if (!result) {
    ctx.body = JSON.stringify({
      addStatus: false,
    });
  } else {
    ctx.body = JSON.stringify({
      addStatus: true,
    });
  }
  await next();
});

friendRelationshipRoute.get('/search', async (ctx, next) => {
  const { account } = ctx.request.query;
  const result = await User.findAll({
    where: {
      account: Number.parseInt(account),
    },
  });
  if (result.length === 0) {
    ctx.body = JSON.stringify({
      searchResult: false,
    });
  } else {
    const {
      name,
      word,
    } = result[0].dataValues;
    ctx.body = JSON.stringify({
      name,
      signature: word,
      account,
      searchResult: true,
    });
  }
  await next();
});

friendRelationshipRoute.post('/handle', async (ctx, next) => {
  acceptOrReject(ctx.request.body);
  ctx.status = 206;
  await next();
});

module.exports = friendRelationshipRoute;
