'use strict';
module.exports = (sequelize, DataTypes) => {
  const calendarRecipe = sequelize.define('calendarRecipe', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    date: DataTypes.DATE,
    recipeUuid: DataTypes.UUID,
    calendarUuid: DataTypes.UUID,
    // Timestamps for migrations
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, { freezeTableName: true });
  return calendarRecipe;
};
