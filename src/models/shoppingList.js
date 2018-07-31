'use strict';
module.exports = (sequelize, DataTypes) => {
  const shoppingList = sequelize.define('shoppingList', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    // Timestamps for migrations
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, { freezeTableName: true });
  shoppingList.associate = function (models) {
    this.belongsToMany(models.item, { through: models.shoppingListItem, as: 'items'});
  };
  return shoppingList;
};
