const psql = require('../psql/models');
const config = require('../config');
const { getPlainFromSequelize } = require('../helper');

const create = async (data, raw = true) => {
  const result = await psql.server.create(data);
  return getPlainFromSequelize(result, raw);
};

/*
 * Find by ID or Slug only!
 * @param {object} findBy Should be like { id } or { slug }
 */
const findBy = async (findBy, raw = true, relations = false) => {
  const result = await psql.server.findOne({
    where: { ...findBy },
    ...(relations && {
      include: [
        {
          model: psql.user,
          limit: config.psql.countUsersInInclude,
        }
      ]
    }),
  });
  return getPlainFromSequelize(result, raw);
};

const getAll = async (
  raw = true,
  page = 1,
  perPage = config.psql.serversAllPerPage,
  order = [['createdAt', 'ASC']],
) => {
  const result = await psql.server.findAndCountAll({
    limit: perPage + ((page - 1) * perPage),
    offset: ((page - 1) * perPage),
    order,
    raw,
  });
  return getPlainFromSequelize(result, raw);
};

module.exports = {
  create,
  findBy,
  getAll,
};
