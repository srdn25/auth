const Router = require('koa-router');
const validator = require('../../validator/v1');
const { server: serverHandler } = require('../../handler');

const router = new Router({ prefix: '/server' });

// Create server
router.post('/', async (ctx) => {
  const data = ctx.request.body;
  validator.server.create(data);
  ctx.body = serverHandler.create(data);
});

module.exports = router;
