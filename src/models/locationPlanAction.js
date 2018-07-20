'use strict';
module.exports = (sequelize, DataTypes) => {
  const locationPlanAction = sequelize.define('locationPlanAction', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    passage: DataTypes.DATE,
    signature: DataTypes.STRING,
    // Timestamps for migrations
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    freezeTableName: true,
    tableName: 'location_plan'
  });

  return locationPlanAction;
};
