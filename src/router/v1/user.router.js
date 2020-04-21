const Router = require('koa-router');

const router = new Router({ prefix: '/user' });

router.get('/ping', (ctx) => {
  ctx.body = { msg: 'pong' };
});

module.exports = router;
