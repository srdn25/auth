const psql = require('../psql/models');
const { getPlainFromSequelize } = require('../helper');

const create = async (data, raw = true) => {
  const result = await psql.session.create(data);
  return getPlainFromSequelize(result, raw);
};
const findBy = async (findBy, raw = true) => {
  const result = await psql.session.findOne({ where: { ...findBy }, raw });
  return getPlainFromSequelize(result, raw);
};
const removeById = async (id) => {
  const result = await psql.session.destroy({ where: { id } });
  return !!result;
};

module.exports = {
  create,
  findBy,
  removeById,
};
