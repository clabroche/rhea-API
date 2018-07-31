'use strict';
module.exports = (sequelize, DataTypes) => {
  const item = sequelize.define('item', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    description: DataTypes.STRING,
    // Timestamps for migrations
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, { freezeTableName: true });
  item.associate = function (models) {
    this.belongsToMany(models.shoppingList, { through: models.shoppingListItem, as: 'shoppingLists'});
  };

  return item;
};
