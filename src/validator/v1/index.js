const { defaultValidateMethod } = require('../../helper');
const exportAll = require('../../../scripts/export_all_from_folder');
const schemas = require('./schemas.json');
const template = require('./template');

const requiredMethods = [
  'create',
  'update',
  'findBy',
  'getAll',
];

const customValidators = exportAll({
  folder: __dirname,
  filter: '.validator.js',
});

const models = Object.keys(schemas);

const validators = models.reduce((acc, model) => {
  const validator = {};

  for (const method of requiredMethods) {
    if (customValidators[model] && customValidators[model][method]) {
      validator[method] = customValidators[model][method]
    } else {
      validator[method] = defaultValidateMethod(schemas[model][method])
    }
  }

  acc[model] = template(validator);
  return acc;
}, {});

module.exports = validators;
