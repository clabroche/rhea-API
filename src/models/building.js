'use strict';
module.exports = (sequelize, DataTypes) => {
  const building = sequelize.define('building', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    color: DataTypes.STRING,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    // Timestamps for migrations
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, { freezeTableName: true });
  building.associate = function (models) {
    this.hasMany(models.level);
    this.belongsTo(models.postalAddress);
    this.hasMany(models.locationAction);
  };
  return building;
};
