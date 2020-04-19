const psql = require('../psql/models');
const { getPlainFromSequelize } = require('../helper');

const create = async (data, raw = true) => {
  const result = await psql.server.create(data);
  return getPlainFromSequelize(result, raw);
};
const findById = async (id, raw = true) => {
  const result = await psql.server.findOne({ where: { id } });
  return getPlainFromSequelize(result, raw);
};
const findBySlug = async (slug, raw = true) => {
  const result = await psql.server.findOne({ where: { slug } });
  return getPlainFromSequelize(result, raw);
};

module.exports = {
  create,
  findById,
  findBySlug,
};
