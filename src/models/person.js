'use strict';
const Promise = require('bluebird');

module.exports = (sequelize, DataTypes) => {
  const person = sequelize.define('person', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    givenName: DataTypes.STRING,
    familyName: DataTypes.STRING,
    gender: DataTypes.CHAR,
    // Timestamps for migrations
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    freezeTableName: true
  });

  person.associate = function (models) {
    this.belongsTo(models.entity);
    this.belongsTo(models.account);
    this.belongsToMany(models.organization, {
      through: 'organization_person'
    });
    this.hasMany(models.planAction);
  };

  person.createWithEntity = function (values, options) {
    const models = this.sequelize.models;
    return Promise.join(
      this.create(values, options),
      models.entity.create(values, options),
      (person, entity) => person.setEntity(entity)
    ).then(person => {
      return this.findById(person.uuid, { include: [models.entity] });
    });
  };

  person.prototype.updateWithEntity = function (values, options) {
    return this.update(values, options)
      .then(() => this.getEntity())
      .then(entity => entity.update(values, options))
      .then(() => {
        const models = this.sequelize.models;
        return models.person.findById(this.uuid, { include: [models.entity] });
      });
  };

  person.prototype.deleteWithEntity = function (values, options) {
    return this.getEntity()
      .then(entity => [entity, this])
      .then((inputModels) => {
        return Promise.map(inputModels, (inputModel) => inputModel.destroy());
      });
  };

  return person;
};
