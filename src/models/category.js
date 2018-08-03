'use strict';
module.exports = (sequelize, DataTypes) => {
  const category = sequelize.define('category', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    // Timestamps for migrations
    updatedAt: DataTypes.DATE,
    createdAt: DataTypes.DATE,
  }, { freezeTableName: true });
  category.associate = function (models) {
    this.hasMany(models.item);
  };
  return category;
};
