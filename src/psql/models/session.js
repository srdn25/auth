'use strict';
module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiredIn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expiredFlag: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {});
  Session.associate = function(models) {
    // associations can be defined here
  };
  return Session;
};
