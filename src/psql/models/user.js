'use strict';
const { userAuthTypeList } = require('../../config');
const { hashUserPassword, compareHashPassword } = require('../../helper');

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

  User.prototype.validPassword = function (password) {
    return compareHashPassword(password, this.password);
  };

  User.beforeCreate((user) => {
    user.password = hashUserPassword(user.password);
  });

  User.associate = function(models) {
    User.hasMany(models.session);
    User.belongsTo(models.server, {
      onDelete: 'CASCADE',
    });
  };

  return User;
};
