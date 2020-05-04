const Router = require('koa-router');
const validator = require('../../validator/v1');

const router = new Router({ prefix: '/server' });

// Create server
router.post('/', (ctx) => {
  const data = ctx.request.body;
  validator.server.create(data);
  ctx.body = data;
});

module.exports = router;
