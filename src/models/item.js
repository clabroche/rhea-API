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
    price: {
      type: DataTypes.FLOAT, 
      defaultValue: 0,
    },
    // Timestamps for migrations
    updatedAt: DataTypes.DATE,
    createdAt: DataTypes.DATE,
  }, { freezeTableName: true });
  item.associate = function (models) {
    this.belongsToMany(models.shoppingList, { through: models.shoppingListItem, as: 'shoppingLists'});
  };

  return item;
};
