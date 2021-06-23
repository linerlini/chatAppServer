const Router = require('@koa/router');
const { chatTBConnect } = require('../../dataBaseInit/modules/chat');
const { Op } = require('sequelize');

const chatRoute = new Router({
  prefix: '/message',
});

chatRoute.get('/', async (ctx, next) => {
  const query = new URLSearchParams(ctx.request.querystring);
  const fromAccount = query.get('fromaccount');
  const findAccount = query.get('findaccount');
  const uid = query.get('uid');
  try {
    const chatTB = await chatTBConnect(fromAccount+'');
    let result = null;
    let startTime = new Date();
    if (uid) {
      const record = await chatTB.findOne({
        where: {
          friendaccount: findAccount,
          uid,
        },
        attributes: ['datetime'],
      });
      startTime = record.dataValues.datetime;
    }
    result = await chatTB.findAll({
      where: {
        friendaccount: findAccount,
        datetime: {
          [Op.lt]: startTime,
        },
      },
      order: [['datetime', 'DESC']],
      limit: 20,
    });
    ctx.body = result;
    console.log(result);    
  } catch (err) {
    console.log(err);
    ctx.body = 'err';
  }

  await next();
});

module.exports = chatRoute;
