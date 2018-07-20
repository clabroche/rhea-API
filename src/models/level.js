'use strict';
module.exports = (sequelize, DataTypes) => {
  const level = sequelize.define('level', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    code: DataTypes.STRING,
    // Timestamps for migrations
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, { freezeTableName: true });
  level.associate = function (models) {
    this.belongsTo(models.building);
    this.hasMany(models.locationAction);
  };
  return level;
};
