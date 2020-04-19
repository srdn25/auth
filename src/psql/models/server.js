'use strict';
module.exports = (sequelize, DataTypes) => {
  const Server = sequelize.define('server', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    url: {
      type: DataTypes.STRING,
      unique: true,
    }
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
    Server.hasMany(models.user);
  };

  return Server;
};
