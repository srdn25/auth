const psql = require('../psql/models');
const { getPlainFromSequelize } = require('../helper');

const create = async (data, raw = true) => {
  const result = await psql.session.create(data);
  return getPlainFromSequelize(result, raw);
};

/*
 * Find by ID or Email only!
 * @param {object} findBy Should be like { id } or { email }
 */
const findBy = async (findBy, raw = true, relations = false) => {
  const result = await psql.session.findOne({
    where: { ...findBy },
    ...(relations && {
      include: [
        {
          model: psql.user,
          include: psql.server,
        }
      ]
    }),
  });
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
