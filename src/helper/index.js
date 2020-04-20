const { Sequelize } = require('../psql/models');

const getPlainFromSequelize = (obj, raw) => obj instanceof Sequelize.Model && raw ? obj.toJSON() : obj;

const lastPage = (countAll, perPage) => Math.ceil(countAll / perPage);
const itemsOnLastPage = (countAll, perPage) => countAll - ((lastPage(countAll, perPage) - 1) * perPage);

module.exports = {
  getPlainFromSequelize,
  lastPage,
  itemsOnLastPage,
};
