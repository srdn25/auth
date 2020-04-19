const psql = require('../psql/models');
const config = require('../config');
const { getPlainFromSequelize } = require('../helper');

const create = async (data, raw = true) => {
  const result = await psql.server.create(data);
  return getPlainFromSequelize(result, raw);
};

const findById = async (id, raw = true, relations = false) => {
  const result = await psql.server.findOne({
    where: { id },
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

const findBySlug = async (slug, raw = true, relations = false) => {
  const result = await psql.server.findOne({
    where: { slug },
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
  findById,
  findBySlug,
};
