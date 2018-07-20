'use strict';

const Promise = require('bluebird');
const faker = require('faker');
const models = require('../models');

const organization = {
  name: 'John DOE Compagny',
  logo: faker.system.filePath(),
  entity: {
    telephone: faker.phone.phoneNumber(),
    email: 'johndoe@compagny.fr',
    type: 'vendor'
  }
};

const admin = {
  givenName: 'John',
  familyName: 'DOE',
  gender: (Math.floor(Math.random() * 10) % 2) ? 'F' : 'M',
  account: {
    login: 'johndoe',
    password: '$argon2i$v=19$m=4096,t=3,p=1$CxnnerAwIpnDdqI6bAjG9w$keNau2CHhpwjs54E3fxu6t5jR0DwMeHTw4SY/Em0hWc'
  },
  entity: {
    telephone: faker.phone.phoneNumber(),
    email: faker.internet.email(),
    type: 'vendor'
  }
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
      description: `permet de ${action.fr} ${nameModel.fr}`
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
        models.person.create(admin, { include: [models.entity, models.account] }),
        models.organization.create(organization, { include: [models.entity] }),
        function (role, admin, organization) {
          return admin.account.setRole(role).then(() => {
            return organization.addPerson(admin);
          });
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
