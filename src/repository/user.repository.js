const psql = require('../psql/models');
const config = require('../config');
const { userAuthTypeList } = require('../config');
const { getPlainFromSequelize } = require('../helper');

const create = async (data, raw = true) => {
  if (!data.type) {
    data.type = userAuthTypeList[0];
  }

  const result = await psql.user.create(data);
  return getPlainFromSequelize(result, raw);
};

const findById = async (id, raw = true, relations = false) => {
  const result = await psql.user.findOne({
    where: { id },
    ...(relations && {
      include: [
        {
          model: psql.session,
          limit: config.psql.countSessionsInInclude,
        }
      ]
    }),
  });
  return getPlainFromSequelize(result, raw);
};

const findByEmail = async (email, raw = true, relations  = false) => {
  const result = await psql.user.findOne({
    where: { email },
    ...(relations && {
      include: [
        {
          model: psql.session,
          limit: config.psql.countSessionsInInclude,
        }
      ]
    }),
  });
  return getPlainFromSequelize(result, raw);
};

const findByServerId = async (
  serverId,
  raw = true,
  page = 1,
  perPage = config.psql.userByServerPerPage,
) => {
  const result = await psql.user.findAndCountAll({
    where: { serverId },
    limit: perPage + ((page - 1) * perPage),
    offset: ((page - 1) * perPage),
    raw,
  });
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
  findByServerId,
  removeById,
};
