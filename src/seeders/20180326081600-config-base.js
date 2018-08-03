'use strict';

const Promise = require('bluebird');
const models = require('../models');
const faker = require('faker');

const admin = {
  login: 'johndoe',
  givenName: 'John',
  familyName: 'DOE',
  password: '$argon2i$v=19$m=4096,t=3,p=1$CxnnerAwIpnDdqI6bAjG9w$keNau2CHhpwjs54E3fxu6t5jR0DwMeHTw4SY/Em0hWc'
};

const nameModels = [
  { en: 'account', fr: 'un compte' },
  { en: 'permission', fr: 'une permission' },
  { en: 'role', fr: 'un role' },
  { en: 'shoppingList', fr: 'une liste de course' },
  { en: 'item', fr: 'un element' },
  { en: 'category', fr: 'une catégorie' },
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

const adminRole = {
  name: 'administrator',
  permissions: allPermissions
};

const items = Array(100).fill('').map(_=>{
  return {
    uuid: faker.random.uuid(),
    name: faker.commerce.productName() + faker.random.uuid().slice(0,3),
    description: faker.commerce.productName()
  }
})
module.exports = {
  up: () => {
    return models.sequelize.sync().then(() => {
      return Promise.join(
        models.role.create(adminRole, { include: [models.permission] }),
        models.account.create(admin),
        function (role, admin) {
          return admin.setRole(role)
        }
      ).then(_=>{
        return Promise.map(items, item=>{
          return models.item.create(item)
        })
      });
    });
  },
  down: () => {
    return Promise.resolve().then(() => {
      return models.sequelize.drop();
    });
  }
};
