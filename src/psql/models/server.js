'use strict';
module.exports = (sequelize, DataTypes) => {
  const Server = sequelize.define('Server', {
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    url: DataTypes.STRING
  }, {});
  Server.associate = function(models) {
    // associations can be defined here
  };
  return Server;
};