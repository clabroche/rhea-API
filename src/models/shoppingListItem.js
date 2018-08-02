'use strict';
module.exports = (sequelize, DataTypes) => {
  const shoppingList = sequelize.define('shoppingListItem', {
    quantity: DataTypes.INTEGER,
    done: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    // Timestamps for migrations
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, { freezeTableName: true });
  return shoppingList;
};
