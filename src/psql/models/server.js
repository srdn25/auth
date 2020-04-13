'use strict';
module.exports = (sequelize, DataTypes) => {
  const Server = sequelize.define('server', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: DataTypes.STRING
  }, {
    tableName: 'server',
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ['slug']
      }
    ],
  });
  Server.associate = function(models) {
    // associations can be defined here
  };
  return Server;
};
