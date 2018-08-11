'use strict';
module.exports = (sequelize, DataTypes) => {
  const calendarRecipe = sequelize.define('calendarRecipe', {
    date: DataTypes.INTEGER,
    // Timestamps for migrations
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, { freezeTableName: true });
  return calendarRecipe;
};
