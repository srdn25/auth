'use strict';
const { userAuthTypeList } = require('../../config');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Email field is not valid',
        },
      },
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
    type: DataTypes.ENUM(userAuthTypeList)
  }, {
    tableName: 'user',
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ['email', 'serverId']
      }
    ],
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
