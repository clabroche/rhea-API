'use strict';
module.exports = (sequelize, DataTypes) => {
  const service = sequelize.define('service', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    // Timestamps for migrations
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, { freezeTableName: true });
  service.associate = function (models) {
    this.belongsToMany(models.offer, {
      through: 'offer_service'
    });
  };

  return service;
};
