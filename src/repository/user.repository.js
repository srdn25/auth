const psql = require('../psql/models');
const config = require('../config');
const templateRepo = require('./template');
const { getPlainFromSequelize } = require('../helper');

const template = templateRepo(psql.user);

const repository = Object.assign({}, template, {
  create: (data, raw) => {
    if (!data.type) {
      data.type = config.userAuthTypeList[0];
    }
    return template.create(data, raw);
  },

  findBy: (options) => template.findBy(options, [
    {
      model: psql.session,
      limit: config.psql.countSessionsInInclude,
    },
    {
      model: psql.server,
    }
  ]),

  findByServerId: async (
    serverId,
    raw = true,
    page = 1,
    perPage = config.psql.modelPerPage,
  ) => {
    const result = await psql.user.findAndCountAll({
      where: { serverId },
      limit: perPage + ((page - 1) * perPage),
      offset: ((page - 1) * perPage),
      order: [['createdAt', 'ASC']],
      raw,
    });
    return getPlainFromSequelize(result, raw);
  },
});

module.exports = repository;
