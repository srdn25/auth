const psql = require('../psql/models');

const create = async (data, raw = true) => {
  const result = await psql.session.create(data);
  return raw ? result.toJSON() : result;
};
const findById = (id, raw = true) => psql.session.findOne({ where: { id }, raw });
const removeById = async (id) => {
  const result = await psql.session.destroy({ where: { id } });
  return !!result;
};

module.exports = {
  create,
  findById,
  removeById,
};
