const fs = require('fs');
const path = require('path');
const psql = require('../psql/models');

const customRepositories = fs.readdirSync(__dirname).reduce((acc, file) => {
  const foundRepo = file.match(/^(\w+)\.repository\.js$/);
  if (foundRepo) {
    acc[foundRepo[1]] = require(path.join(__dirname, foundRepo[0]));
  }
  return acc;
}, {});

const repositories = Object.entries(psql).reduce((acc, [name, model]) => {
  if (customRepositories[name]) {
    acc[name] = customRepositories[name];
  } else {
    acc[name] = require('./template')(model);
  }

  return acc;
}, {});

module.exports = repositories;
