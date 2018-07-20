const Promise = require('bluebird');
const { combineResolvers } = require('graphql-resolvers');
const { can } = require('./helpers');
const models = require('../models');

const resolvers = {
  Query: {
    personById: combineResolvers(
      can('person:read'),
      (_, { uuid }) => models.person.findById(uuid, { include: [models.entity] })
    ),
    people: combineResolvers(
      can('person:read'),
      () => models.person.findAll({ include: [models.entity] })
    )
  },
  Mutation: {
    personCreate: combineResolvers(
      can('person:create'),
      (_, { input }) => {
        return models.person.createWithEntity(input).then((person) => {
          if (!input.postalAddresseUuids) return person;
          const Op = models.Sequelize.Op;
          return models.postalAddress.findAll({
            where: {
              [Op.or]: input.postalAddresseUuids.map(uuid => ({uuid}))
            }
          }).then(postalAddresses => {
            return person.entity.setPostalAddresses(postalAddresses);
          }).then(() => {
            return models.person.findById(person.uuid, {
              include: [{
                model: models.entity,
                include: [models.postalAddress]
              }]
            });
          });
        });
      }
    ),
    personUpdate: combineResolvers(
      can('person:update'),
      (_, { uuid, input }) => {
        return models.person.findById(uuid).then(person => {
          if (!person) return Promise.reject(new Error('unknown uuid'));
          return person.updateWithEntity(input);
        }).then((person) => {
          if (!input.postalAddresseUuids) return person;
          const Op = models.Sequelize.Op;
          return models.postalAddress.findAll({
            where: {
              [Op.or]: input.postalAddresseUuids.map(uuid => ({uuid}))
            }
          }).then(postalAddresses => {
            return person.entity.setPostalAddresses(postalAddresses);
          }).then(() => {
            return models.person.findById(person.uuid, {
              include: [{
                model: models.entity,
                include: [models.postalAddress]
              }]
            });
          });
        });
      }
    ),
    personDelete: combineResolvers(
      can('person:delete'),
      (_, { uuid }) => {
        return models.person.findById(uuid).then(person => {
          if (!person) return Promise.reject(new Error('unknown uuid'));
          return person.deleteWithEntity();
        }).then(() => Promise.resolve(true));
      }
    )
  },
  Person: {
    account: combineResolvers(
      can('account:read'),
      (person) => person.getAccount()
    ),
    postalAddresses: combineResolvers(
      can('postalAddress:read'),
      (person) => person.entity.getPostalAddresses()
    ),
    worksFor: combineResolvers(
      can('organization:read'),
      (person) => {
        return person.getOrganizations().map(organization => {
          return models.organization.findById(organization.uuid, {
            include: [models.entity]
          });
        });
      }
    ),
    actions: combineResolvers(
      can('action:read'),
      (person) => person.entity.getActions()
    )
  }
};

module.exports = resolvers;
