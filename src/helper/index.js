const bcrypt = require('bcrypt');

const lastPage = (countAll, perPage) => Math.ceil(countAll / perPage);
const itemsOnLastPage = (countAll, perPage) => countAll - ((lastPage(countAll, perPage) - 1) * perPage);

const hashUserPassword = (password) => {
  const salt = bcrypt.genSaltSync(7);
  return bcrypt.hashSync(password, salt);
};
const compareHashPassword = (password, dbPassword) => bcrypt.compareSync(password, dbPassword);

module.exports = {
  lastPage,
  itemsOnLastPage,
  hashUserPassword,
  compareHashPassword,
};
