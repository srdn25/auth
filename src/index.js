const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Boom = require('boom');

const routerList = require('./router');

const app = new Koa();
const port = process.env.PORT || 3033;

app.use(bodyParser());

// init routes
for(const [key, router] of Object.entries(routerList)) {
  app.use(router.routes());
  app.use(router.allowedMethods({
    throw: true,
    notImplemented: () => new Boom.notImplemented(),
    methodNotAllowed: () => new Boom.methodNotAllowed(),
  }));
  console.log(`Routes for ${key} initialized`);
};

//logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.listen(port, () => {
  console.log(`Application running on ${port} port`)
});
