const Router = require('koa-router');

const router = new Router({ prefix: '/server' });

// Create server
router.post('/', (ctx) => {
  const data = ctx.requrest.body;
  ctx.body = data;
});

module.exports = router;
