'use strict';
module.exports = (sequelize, DataTypes) => {
  const offer = sequelize.define('offer', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    aviabilyStarts: DataTypes.DATE,
    aviabilyEnds: DataTypes.DATE,
    price: DataTypes.FLOAT,
    category: DataTypes.STRING,
    color: DataTypes.STRING,
    marker: DataTypes.STRING,
    // Timestamps for migrations
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, { freezeTableName: true });

  offer.associate = function (models) {
    this.belongsTo(models.organization);
    this.belongsToMany(models.service, {
      through: 'offer_service'
    });
    this.hasMany(models.action);
  };

  return offer;
};
