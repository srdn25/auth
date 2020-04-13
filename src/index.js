const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const routerList = require('./router');

const app = new Koa();

app.use(bodyParser());
app.use(async (ctx) => ctx.body = ctx.request.body);

// init routes
for(const [key, router] of Object.entries(routerList)) {
  app.use(router.routes());
  app.use(router.allowedMethods());
  console.log(`Routes for ${key} initialised`);
};

//logger
app.use(async (ctx) => {
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

app.use(async (ctx) => {
  ctx.body = 'Pong';
});

app.listen(3000);
