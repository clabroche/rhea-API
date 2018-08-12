'use strict';
module.exports = (sequelize, DataTypes) => {
  const recipe = sequelize.define('recipe', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING,
    img: DataTypes.STRING,
    time: DataTypes.STRING,
    preparation: DataTypes.TEXT,
    nbPerson: DataTypes.INTEGER,
    // Timestamps for migrations
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, { freezeTableName: true });
  recipe.associate = function (models) {
    this.belongsToMany(models.item, { through: models.recipeItem, as: 'items'});

  };
  return recipe;
};
