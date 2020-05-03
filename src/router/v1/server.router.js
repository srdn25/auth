const Router = require('koa-router');
const validator = require('../../validator/v1');

const router = new Router({ prefix: '/server' });

// Create server
router.post('/', (ctx) => {
  validator.server.create(ctx.request.body);
  ctx.body = data;
});

module.exports = router;
