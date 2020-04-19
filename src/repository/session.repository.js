const psql = require('../psql/models');
const { getPlainFromSequelize } = require('../helper');

const create = async (data, raw = true) => {
  const result = await psql.session.create(data);
  return getPlainFromSequelize(result, raw);
};
const findById = async (id, raw = true) => {
  const result = await psql.session.findOne({ where: { id }, raw });
  return getPlainFromSequelize(result, raw);
};
const removeById = async (id) => {
  const result = await psql.session.destroy({ where: { id } });
  return !!result;
};

module.exports = {
  create,
  findById,
  removeById,
};
