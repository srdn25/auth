const { expect } = require('chai');

const importFolder = require('../scripts/export_all_from_folder');
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
  filter: '.spec.js',
});
importFolder({
  folder: __dirname + '/repository_relations',
  filter: '.spec.js',
});
importFolder({
  folder: __dirname + '/helper',
  filter: '.spec.js',
});
