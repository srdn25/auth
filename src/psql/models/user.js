'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    approved: DataTypes.BOOLEAN,
    info: DataTypes.JSONB,
    serverId: DataTypes.INTEGER,
    type: DataTypes.ENUM('BASIC')
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
