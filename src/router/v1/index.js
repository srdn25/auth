const Router = require('koa-router');

const router = new Router({ prefix: '/v1' });

router.post('/signup', (ctx) => {
  const {
    email,
    name,
    password,
  } = ctx.request.body;

  ctx.body = { name }
});

module.exports = router;
