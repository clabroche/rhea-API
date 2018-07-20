'use strict';
module.exports = (sequelize, DataTypes) => {
  const action = sequelize.define('action', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    description: DataTypes.TEXT,
    // Timestamps for migrations
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, { freezeTableName: true });

  action.associate = function (models) {
    this.hasMany(models.planAction);
    this.hasMany(models.locationAction);
    this.belongsTo(models.entity);
    this.belongsTo(models.offer);
  };

  return action;
};
