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

module.exports = {
  create,
  findBy,
};
