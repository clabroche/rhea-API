'use strict';
module.exports = (sequelize, DataTypes) => {
  const postalAddress = sequelize.define('postalAddress', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING,
    streetAddress: DataTypes.STRING,
    postalCode: DataTypes.STRING,
    addressLocality: DataTypes.STRING,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    // Timestamps for migrations
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, { freezeTableName: true });
  postalAddress.associate = function (models) {
    this.hasMany(models.building);
    this.belongsTo(models.entity);
    this.hasMany(models.locationAction);
  };
  return postalAddress;
};
