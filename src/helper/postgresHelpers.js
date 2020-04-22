const { Sequelize } = require('../psql/models');

const getPlainFromSequelize = (obj, raw) => obj instanceof Sequelize.Model && raw ? obj.toJSON() : obj;

module.exports = {
  getPlainFromSequelize,
};
