'use strict';
module.exports = (sequelize, DataTypes) => {
  const locationAction = sequelize.define('locationAction', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    // Timestamps for migrations
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, { freezeTableName: true });

  locationAction.associate = function (models) {
    this.belongsTo(models.action);
    this.belongsTo(models.postalAddress);
    this.belongsTo(models.building);
    this.belongsTo(models.level);
    this.belongsToMany(models.planAction, { through: models.locationPlanAction });
  };

  return locationAction;
};
