const Router = require('koa-router');
const router = new Router({ prefix: '/api' });

const v1 = require('./v1');

router.use(v1.routes(), v1.allowedMethods({
  throw: true,
}));

module.exports = router;
