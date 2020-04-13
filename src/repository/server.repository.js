const psql = require('../psql/models');

const create = (data) => psql.server.create(data);

module.exports = {
  create,
};
