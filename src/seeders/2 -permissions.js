'use strict';

const Promise = require('bluebird');
const models = require('../models');
const faker = require('faker');


const nameModels = [
  { en: 'calendar', fr: 'un calendrier' },
];

const actions = [
  { en: 'create', fr: 'créer' },
  { en: 'read', fr: 'lire' },
  { en: 'update', fr: 'modifier' },
  { en: 'delete', fr: 'supprimer' },
  { en: 'add', fr: 'ajouter' },
  { en: 'remove', fr: 'enlever' }
];

const allPermissions = nameModels.map(nameModel => {
  return actions.map(action => {
    return {
      name: `${nameModel.en}:${action.en}`,
      description: `Permet de ${action.fr} ${nameModel.fr}`
    };
  });
}).reduce((a, b) => a.concat(b), []);



const items = require('../mock/mock.json').items

module.exports = {
  up: () => {
    return models.role.find({
      where: {name: 'administrator'},
      include: models.permission,
      through: 'role_permission'
    }).then(async adminRole=>{
      const permissions = await Promise.map(allPermissions, async permission=>{
        permission = await models.permission.create(permission)
        return permission.uuid
      })
      console.log(permissions)
      return adminRole.addPermissions(permissions)
    })
  },
  down: () => {
    return Promise.resolve().then(() => {
      return models.sequelize.drop();
    });
  }
};
