'use strict';
const Promise = require('bluebird');

module.exports = (sequelize, DataTypes) => {
  const organization = sequelize.define('organization', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING,
    logo: DataTypes.STRING,
    // Timestamps for migrations
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, { freezeTableName: true });

  organization.associate = function (models) {
    this.belongsTo(models.entity);
    this.belongsTo(models.organization, { as: 'memberOf' });
    this.belongsToMany(models.person, {
      through: 'organization_person'
    });
    this.hasMany(models.offer);
  };

  organization.createWithEntity = function (values, options) {
    const models = this.sequelize.models;
    return Promise.join(
      this.create(values, options),
      models.entity.create(values, options),
      (organization, entity) => organization.setEntity(entity)
    ).then(organization => {
      return this.findById(organization.uuid, { include: [models.entity] });
    });
  };

  organization.prototype.updateWithEntity = function (values, options) {
    return this.update(values, options)
      .then(() => this.getEntity())
      .then(entity => entity.update(values, options))
      .then(() => {
        const models = this.sequelize.models;
        return models.organization.findById(this.uuid, { include: [models.entity] });
      });
  };

  organization.prototype.deleteWithEntity = function (values, options) {
    return this.getEntity()
      .then(entity => [entity, this])
      .then((inputModels) => {
        return Promise.map(inputModels, (inputModel) => inputModel.destroy());
      });
  };
  return organization;
};
