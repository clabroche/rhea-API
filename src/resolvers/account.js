const Promise = require('bluebird');
const argon2 = require('argon2');
const { combineResolvers } = require('graphql-resolvers');
const { can } = require('./helpers');
const models = require('../models');

const resolvers = {
  Query: {
    accountById: combineResolvers(
      can('account:read'),
      (_, { uuid }) => models.account.findById(uuid)
    ),
    accounts: combineResolvers(
      can('account:read'),
      () => models.account.findAll()
    )
  },
  Mutation: {
    accountCreate: combineResolvers(
      can('account:create'),
      (_, { input }) => {
        return Promise.resolve(input).then(input => {
          if (!input.password) return Promise.reject(new Error('missing password'));
          return argon2.hash(input.password).then(hash => {
            input.password = hash;
            return input;
          });
        }).then(input => {
          if (!input.user) return models.account.create(input).then((account) => ({ input, account }));
          return Promise.join(
            models.account.create(input),
            models.person.createWithEntity(input.user),
            (account, person) => account.setPerson(person).then(() => ({ input, account }))
          );
        }).then(({ input, account }) => {
          if (!input.roleUuid) return account;
          return models.role.findById(input.roleUuid)
            .then(role => account.setRole(role))
            .then(() => account);
        }).then(account => {
          return models.account.findById(account.uuid, {
            include: [models.role, {
              model: models.person,
              include: [models.entity]
            }]
          });
        });
      }
    ),
    accountUpdate: combineResolvers(
      can('account:update'),
      (_, { uuid, input }) => {
        return models.account.findById(uuid, {
          include: [models.role, {
            model: models.person,
            include: [models.entity]
          }]
        }).then(account => {
          if (!input.password) return { input, account };
          return argon2.hash(input.password).then(hash => {
            input.password = hash;
            return { input, account };
          });
        }).then(({ input, account }) => {
          if (!input.user) return account.update(input).then(account => ({ input, account }));
          return account.update(input)
            .then(account => account.person.updateWithEntity(input.user))
            .then(() => ({ input, account }));
        }).then(({ input, account }) => {
          if (!input.roleUuid) return account;
          return models.role.findById(input.roleUuid)
            .then(role => account.setRole(role))
            .then(() => account);
        }).then(account => {
          return models.account.findById(account.uuid, {
            include: [models.role, {
              model: models.person,
              include: [models.entity]
            }]
          });
        });
      }
    ),
    accountDelete: combineResolvers(
      can('account:delete'),
      (_, { uuid }) => {
        return models.account.findById(uuid, {
          include: [models.role, {
            model: models.person,
            include: [models.entity]
          }]
        }).then(account => {
          if (!account) return Promise.reject(new Error('unknown uuid'));
          return Promise.join(
            account.destroy(),
            account.person.destroy(),
            account.person.entity.destroy(),
            () => Promise.resolve(true)
          );
        });
      }
    )
  },
  Account: {
    user: combineResolvers(
      can('person:read'),
      (account) => {
        return account.getPerson().then((person) => {
          return models.person.findById(person.uuid, {
            include: [models.entity]
          });
        });
      }
    ),
    role: combineResolvers(
      can('role:read'),
      (account) => account.getRole()
    )
  }
};

module.exports = resolvers;
