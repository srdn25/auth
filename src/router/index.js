const Router = require('koa-router');
const router = new Router();

router.get('/ping', (ctx, next) => {
  ctx.body({
    msg: 'pong',
  });
});

module.exports = {
  main: router
};
