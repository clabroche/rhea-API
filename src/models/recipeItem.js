'use strict';
module.exports = (sequelize, DataTypes) => {
  const recipeItem = sequelize.define('recipeItem', {
    quantity: DataTypes.INTEGER,
    // Timestamps for migrations
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, { freezeTableName: true });
  return recipeItem;
};
