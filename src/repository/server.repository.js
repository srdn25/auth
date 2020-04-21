const psql = require('../psql/models');
const config = require('../config');
const templateRepo = require('./template');

const template = templateRepo(psql.server);

const repository = Object.assign({}, template, {
  findBy: (options) => template.findBy(options, [
    {
      model: psql.user,
      limit: config.psql.countUsersInInclude,
    }
  ])
});

module.exports = repository;
