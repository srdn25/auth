'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    info: DataTypes.JSONB,
    serverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: DataTypes.ENUM('BASIC')
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
