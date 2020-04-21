const Router = require('koa-router');

const router = new Router({ prefix: '/user' });

router.post('/', (ctx) => {
  ctx.requrest.body;
});

module.exports = router;
