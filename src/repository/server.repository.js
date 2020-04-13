const psql = require('../psql/models');

const create = (data) => psql.server.create(data);
const findById = (id) => psql.server.findOne({ where: { id } });
const findBySlug = (slug) => psql.server.findOne({ where: { slug } });

module.exports = {
  create,
  findById,
  findBySlug,
};
