const { expect } = require('chai');

const config = require('../src/config');
const { sequelize } = require('../src/psql/models');

global.expect = expect;
global.config = config;

before(async () => {
  await sequelize.sync({ force: true });
});

after(async () => {
  await sequelize.close();
});

require('require-all')({
  dirname: __dirname + '/repository',
  filter: /spec\.js$/i,
  recursive: true,
});
