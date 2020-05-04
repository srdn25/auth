const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Boom = require('boom');

const router = require('./router');

const app = new Koa();
const port = process.env.PORT || 3033;

app.use(bodyParser());

// error handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = Array.isArray(err) ? err.map((e) => e.message) : err.message;
  }
});

// init routes
app.use(router.routes());
app.use(router.allowedMethods({
  throw: true,
  notImplemented: () => new Boom.notImplemented(),
  methodNotAllowed: () => new Boom.methodNotAllowed(),
}));

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
