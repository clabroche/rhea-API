'use strict';
module.exports = (sequelize, DataTypes) => {
  const inventory = sequelize.define('inventory', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    // Timestamps for migrations
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, { freezeTableName: true });
  inventory.associate = function (models) {
    this.belongsToMany(models.item, { through: models.inventoryItem, as: 'items'});
  };
  return inventory;
};
