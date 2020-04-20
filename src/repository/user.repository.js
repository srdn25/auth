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

/*
 * Find by ID or Email only!
 * @param {object} findBy Should be like { id } or { email }
 */
const findBy = async (findBy, raw = true, relations = false) => {
  const result = await psql.user.findOne({
    where: { ...findBy },
    ...(relations && {
      include: [
        {
          model: psql.session,
          limit: config.psql.countSessionsInInclude,
        },
        {
          model: psql.server,
        }
      ]
    }),
  });
  return getPlainFromSequelize(result, raw);
};

/*
 * Update user. In findBy preference use ID of user. Or email + serverId
 */
const update = async (data, findBy) => {
  const [ updatedRows ] = await psql.user.update(
    { ...data },
    { where: { ...findBy } },
  );

  return updatedRows;
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
    order: [['createdAt', 'ASC']],
    raw,
  });
  return getPlainFromSequelize(result, raw);
};

const getAll = async ({
  raw = true,
  page = 1,
  perPage = config.psql.usersAllPerPage,
  order = [['createdAt', 'ASC']],
  findBy,
}) => {
  const result = await psql.user.findAndCountAll({
    limit: perPage + ((page - 1) * perPage),
    offset: ((page - 1) * perPage),
    order,
    raw,
    ...(findBy && { where: { ...findBy } }),
  });
  return getPlainFromSequelize(result, raw);
};

const removeById = async (id) => {
  const result = await psql.user.destroy({ where: { id } });
  return !!result;
};

module.exports = {
  create,
  findBy,
  findByServerId,
  getAll,
  removeById,
  update,
};
