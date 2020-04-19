const { expect } = require('chai');

const importFolder = require('../scripts/import_by_sort');
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


importFolder({
  folder: __dirname + '/repository',
  filter: /spec\.js$/i,
});
importFolder({
  folder: __dirname + '/repository_relations',
  filter: /spec\.js$/i,
});
