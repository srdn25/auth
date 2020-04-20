'use strict';
const bcrypt = require('bcrypt');
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

  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  User.beforeCreate((user) => {
    const salt = bcrypt.genSaltSync(7);
    user.password = bcrypt.hashSync(user.password, salt);
  });

  User.associate = function(models) {
    User.hasMany(models.session, {
      onDelete: 'CASCADE',
    });
    User.belongsTo(models.server);
  };

  return User;
};
