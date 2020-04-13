'use strict';
module.exports = (sequelize, DataTypes) => {
  const Server = sequelize.define('Server', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: DataTypes.STRING
  }, {});
  Server.associate = function(models) {
    // associations can be defined here
  };
  return Server;
};
