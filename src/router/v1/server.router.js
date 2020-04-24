const Router = require('koa-router');

const router = new Router({ prefix: '/user' });

// Create server
router.post('/', (ctx) => {
  const data = ctx.requrest.body;
});

module.exports = router;
