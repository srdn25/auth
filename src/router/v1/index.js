const Router = require('koa-router');
const userRouter = require('./user.router');

const router = new Router({ prefix: '/v1' });

router.use(userRouter.routes(), userRouter.allowedMethods());

module.exports = router;
