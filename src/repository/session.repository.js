const psql = require('../psql/models');
const templateRepo = require('./template');

const template = templateRepo(psql.session);

const repository = Object.assign({}, template, {
  findBy: (options) => template.findBy(options, [
    {
      model: psql.user,
      include: psql.server,
    }
  ]),
});

module.exports = repository;
