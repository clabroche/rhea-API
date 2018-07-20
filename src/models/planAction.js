'use strict';
module.exports = (sequelize, DataTypes) => {
  const planAction = sequelize.define('planAction', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    description: DataTypes.TEXT,
    type: DataTypes.ENUM('estimated', 'real'),
    // Timestamps for migrations
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, { freezeTableName: true });

  planAction.associate = function (models) {
    this.belongsTo(models.action);
    this.belongsTo(models.person);
    this.belongsToMany(models.locationAction, { through: models.locationPlanAction });
    this.hasMany(models.planAction, { as: 'parentPlanAction' });
  };

  return planAction;
};
