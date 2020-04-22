const config = require('../config');
const { getPlainFromSequelize } = require('../helper/postgresHelpers');

module.exports = function (model) {
  return {
    create: async (data, raw = true) => {
      const result = await model.create(data);
      return getPlainFromSequelize(result, raw);
    },

    /*
     * Find by model fields!
     * @param {object} findBy Should be like { id } or { email }
     */
    findBy: async ({
      by,
      raw = true,
      relations = false,
    }, include) => {
      if (!by) {
        throw new Error('required "by" field');
      }
      const result = await model.findOne({
        where: { ...by },
        ...(relations && { include }),
      });
      return getPlainFromSequelize(result, raw);
    },

    /*
     * Update model. In findBy preference use ID of model
     */
    update: async (data, findBy) => {
      const [updatedRows] = await model.update(
        { ...data },
        { where: { ...findBy } },
      );

      return updatedRows;
    },

    getAll: async ({
      raw = true,
      page = 1,
      perPage = config.psql.modelPerPage,
      order = [['createdAt', 'ASC']],
      findBy,
    }) => {
      const result = await model.findAndCountAll({
        limit: perPage + ((page - 1) * perPage),
        offset: ((page - 1) * perPage),
        order,
        raw,
        ...(findBy && { where: { ...findBy } }),
      });
      return getPlainFromSequelize(result, raw);
    },

    removeById: async (id) => {
      const result = await model.destroy({ where: { id } });
      return !!result;
    }
  };
};
