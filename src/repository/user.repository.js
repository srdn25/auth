const psql = require('../psql/models');
const { userAuthTypeList } = require('../config');
const { getPlainFromSequelize } = require('../helper');

const create = async (data, raw = true) => {
  if (!data.type) {
    data.type = userAuthTypeList[0];
  }

  const result = await psql.user.create(data);
  return getPlainFromSequelize(result, raw);
};

const findById = async (id, raw = true) => {
  const result = await psql.user.findOne({ where: { id }, raw });
  return getPlainFromSequelize(result, raw);
};

const findByEmail = async (email, raw = true) => {
  const result = await psql.user.findOne({ where: { email }, raw });
  return getPlainFromSequelize(result, raw);
};

const removeById = async (id) => {
  const result = await psql.user.destroy({ where: { id } });
  return !!result;
};

module.exports = {
  create,
  findById,
  findByEmail,
  removeById,
};
