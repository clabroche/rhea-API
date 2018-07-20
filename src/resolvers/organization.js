const Promise = require('bluebird');
const { combineResolvers } = require('graphql-resolvers');
const { can } = require('./helpers');
const models = require('../models');

const resolvers = {
  Query: {
    organizationById: combineResolvers(
      can('organization:read'),
      (_, { uuid }) => models.organization.findById(uuid, { include: [models.entity] })
    ),
    organizations: combineResolvers(
      can('organization:read'),
      (_, filter) => {
        const modelEntity = { model: models.entity };
        if (filter && filter.hasOwnProperty('type')) modelEntity.where = { type: filter.type };
        return models.organization.findAll({ include: [modelEntity] });
      }
    )
  },
  Mutation: {
    organizationCreate: combineResolvers(
      can('organization:create'),
      (_, { input }) => {
        return models.organization.createWithEntity(input).then((organization) => {
          // PostalAddress
          if (!input.postalAddresseUuids) return organization;
          const Op = models.Sequelize.Op;
          return models.postalAddress.findAll({
            where: {
              [Op.or]: input.postalAddresseUuids.map(uuid => ({uuid}))
            }
          }).then(postalAddresses => {
            return organization.entity.setPostalAddresses(postalAddresses);
          }).then(() => organization);
        }).then(organization => {
          // Customers
          if (!input.customerUuids) return organization;
          const Op = models.Sequelize.Op;
          const customerUuids = input.customerUuids.map(uuid => ({uuid}));
          return Promise.join(
            models.organization.findAll({
              where: { [Op.or]: customerUuids },
              include: [models.entity]
            }),
            models.person.findAll({
              where: { [Op.or]: customerUuids },
              include: [models.entity]
            }),
            (organizations, people) => {
              return [...organizations, ...people];
            }
          ).then(customers => {
            return organization.entity.addCustomers(customers.map(customer => customer.entity));
          }).then(() => organization);
        }).then(organization => {
          return models.organization.findById(organization.uuid, {
            include: [{
              model: models.entity,
              include: [models.postalAddress, {
                model: models.entity,
                as: 'customers'
              }]
            }]
          });
        });
      }
    ),
    organizationUpdate: combineResolvers(
      can('organization:update'),
      (_, { uuid, input }) => {
        return models.organization.findById(uuid).then(organization => {
          if (!organization) return Promise.reject(new Error('unknown uuid'));
          return organization.updateWithEntity(input);
        }).then((organization) => {
          // PostalAddress
          if (!input.postalAddresseUuids) return organization;
          const Op = models.Sequelize.Op;
          return models.postalAddress.findAll({
            where: {
              [Op.or]: input.postalAddresseUuids.map(uuid => ({uuid}))
            }
          }).then(postalAddresses => {
            return organization.entity.setPostalAddresses(postalAddresses);
          }).then(() => organization);
        }).then(organization => {
          // Customers
          if (!input.customerUuids) return organization;
          const Op = models.Sequelize.Op;
          const customerUuids = input.customerUuids.map(uuid => ({uuid}));
          return Promise.join(
            models.organization.findAll({
              where: { [Op.or]: customerUuids },
              include: [models.entity]
            }),
            models.person.findAll({
              where: { [Op.or]: customerUuids },
              include: [models.entity]
            }),
            (organizations, people) => {
              return [...organizations, ...people];
            }
          ).then(customers => {
            return organization.entity.setCustomers(customers.map(customer => customer.entity));
          }).then(() => organization);
        }).then(organization => {
          return models.organization.findById(organization.uuid, {
            include: [{
              model: models.entity,
              include: [models.postalAddress, {
                model: models.entity,
                as: 'customers'
              }]
            }]
          });
        });
      }
    ),
    organizationDelete: combineResolvers(
      can('organization:delete'),
      (_, { uuid }) => {
        return models.organization.findById(uuid).then(organization => {
          if (!organization) return Promise.reject(new Error('unknown uuid'));
          return organization.deleteWithEntity();
        }).then(() => Promise.resolve(true));
      }
    )
  },
  Organization: {
    employees: combineResolvers(
      can('person:read'),
      (organization) => {
        return organization.getPeople().map(person => {
          return models.person.findById(person.uuid, {
            include: [models.entity]
          });
        });
      }
    ),
    postalAddresses: combineResolvers(
      can('postalAddress:read'),
      (organization) => organization.entity.getPostalAddresses()
    ),
    memberOf: combineResolvers(
      can('organization:read'),
      (organization) => {
        return organization.getMemberOf().then(organizationParent => {
          if (!organizationParent) return null;
          return models.organization.findById(organizationParent.uuid, {
            include: [models.entity]
          });
        });
      }
    ),
    customers: combineResolvers(
      can('person:read'),
      can('organization:read'),
      (organization) => {
        return organization.getEntity().then((entity) => {
          return entity.getCustomers();
        }).then(customers => {
          return Promise.map(customers, (customer) => {
            return models.entity.findById(customer.uuid, {
              include: [{
                model: models.organization,
                include: [models.entity]
              }, {
                model: models.person,
                include: [models.entity]
              }]
            });
          }).map(entity => {
            if (entity.organization) return entity.organization;
            if (entity.person) return entity.person;
          });
        });
      }
    ),
    makesOffer: combineResolvers(
      can('offer:read'),
      (organization) => organization.getOffers()
    ),
    actions: combineResolvers(
      can('action:read'),
      (organization) => organization.entity.getActions()
    )
  }
};

module.exports = resolvers;
