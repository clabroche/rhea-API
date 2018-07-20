'use strict';
module.exports = (sequelize, DataTypes) => {
  const entity = sequelize.define('entity', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    telephone: DataTypes.STRING,
    email: DataTypes.STRING,
    type: DataTypes.ENUM('customer', 'vendor'),
    // Timestamps for migrations
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, { freezeTableName: true });
  entity.associate = function (models) {
    this.hasOne(models.organization);
    this.hasOne(models.person);
    this.hasMany(models.action);
    this.belongsToMany(models.entity, { as: 'customers', through: 'customer_vendor' });
    this.hasMany(models.postalAddress);
  };
  return entity;
};
