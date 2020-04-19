const psql = require('../psql/models');

const create = (data) => psql.session.create(data);
const findById = (id) => psql.session.findOne({ where: { id } });
const removeById = async (id) => {
  const result = await psql.session.destroy({ where: { id } });
  return !!result;
};

module.exports = {
  create,
  findById,
  removeById,
};
