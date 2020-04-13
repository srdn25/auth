'use strict';
module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    userId: DataTypes.INTEGER,
    ip: DataTypes.STRING,
    token: DataTypes.STRING,
    expiredIn: DataTypes.DATE,
    expiredFlag: DataTypes.BOOLEAN
  }, {});
  Session.associate = function(models) {
    // associations can be defined here
  };
  return Session;
};