const bcrypt = require('bcrypt');
const Ajv = require('ajv');

const lastPage = (countAll, perPage) => Math.ceil(countAll / perPage);
const itemsOnLastPage = (countAll, perPage) => countAll - ((lastPage(countAll, perPage) - 1) * perPage);

const hashUserPassword = (password) => {
  const salt = bcrypt.genSaltSync(7);
  return bcrypt.hashSync(password, salt);
};
const compareHashPassword = (password, dbPassword) => bcrypt.compareSync(password, dbPassword);

const defaultValidateMethod = (schema) => {
  return (data) => {
    const ajv = new Ajv();

    const validate = ajv.compile(schema);
    const valid = validate(data);

    if (!valid) throw validate.errors;

    return data;
  };
};

module.exports = {
  lastPage,
  itemsOnLastPage,
  hashUserPassword,
  compareHashPassword,
  defaultValidateMethod,
};
