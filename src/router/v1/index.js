const Router = require('koa-router');
const exportAll = require('../../../scripts/export_all_from_folder');
const router = new Router({ prefix: '/v1' });

const routes = exportAll({
  folder: __dirname,
  filter: '.router.js',
});

for (const [name, route] of Object.entries(routes)) {
  router.use(route.routes(), route.allowedMethods({
    throw: true,
  }));
  console.log(`Router init ${name}`)
}

module.exports = router;
