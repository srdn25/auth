const exportAll = require('../../scripts/export_all_from_folder');

module.exports = exportAll({
  folder: __dirname,
  filter: '.handler.js'
});
