'use strict';

const Promise = require('bluebird');
const models = require('../models');

const admin = {
  login: 'johndoe',
  givenName: 'John',
  familyName: 'DOE',
  password: '$argon2i$v=19$m=4096,t=3,p=1$CxnnerAwIpnDdqI6bAjG9w$keNau2CHhpwjs54E3fxu6t5jR0DwMeHTw4SY/Em0hWc'
};

const nameModels = [
  { en: 'account', fr: 'un compte' },
  { en: 'building', fr: 'un batiment' },
  { en: 'level', fr: 'un niveau' },
  { en: 'offer', fr: 'une offre' },
  { en: 'organization', fr: 'une organisation' },
  { en: 'permission', fr: 'une permission' },
  { en: 'person', fr: 'une personne' },
  { en: 'postalAddress', fr: 'une adresse postale' },
  { en: 'role', fr: 'un role' },
  { en: 'service', fr: 'un service' },
  { en: 'action', fr: 'une intervention' },
  { en: 'planAction', fr: 'une plannification d\'intervention' },
  { en: 'locationAction', fr: 'un lieu d\'intervention' }
];

const actions = [
  { en: 'create', fr: 'créer' },
  { en: 'read', fr: 'lire' },
  { en: 'update', fr: 'modifier' },
  { en: 'delete', fr: 'supprimer' }
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

module.exports = {
  up: () => {
    return models.sequelize.sync().then(() => {
      return Promise.join(
        models.role.create(adminRole, { include: [models.permission] }),
        models.account.create(admin),
        function (role, admin) {
          return admin.setRole(role)
        }
      );
    });
  },
  down: () => {
    return Promise.resolve().then(() => {
      return models.sequelize.drop();
    });
  }
};
