'use strict';
module.exports = (sequelize, DataTypes) => {
  const calendar = sequelize.define('calendar', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    // Timestamps for migrations
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, { freezeTableName: true });
  calendar.associate = function (models) {
    this.belongsToMany(models.item, { through: models.calendarRecipe, as: 'recipes'});
  };
  return calendar;
};
