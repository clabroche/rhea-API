const { combineResolvers } = require('graphql-resolvers');
const { can } = require('./helpers');
const models = require('../models');

const resolvers = {
  Query: {
    serviceById: combineResolvers(
      can('service:read'),
      (_, { uuid }) => models.service.findById(uuid)
    ),
    services: combineResolvers(
      can('service:read'),
      () => models.service.findAll()
    )
  },
  Mutation: {
    serviceCreate: combineResolvers(
      can('service:create'),
      (_, { input }) => {
        return models.service.create(input).then(service => {
          if (!input.offerUuids) return service;
          const Op = models.Sequelize.Op;
          return models.offer.findAll({
            where: {
              [Op.or]: input.offerUuids.map(offerUuid => ({uuid: offerUuid}))
            }
          }).then(offers => {
            return service.addOffers(offers);
          }).then(() => service);
        }).then(service => {
          return models.service.findById(service.uuid, {
            include: [models.offer]
          });
        });
      }
    ),
    serviceUpdate: combineResolvers(
      can('service:update'),
      (_, { uuid, input }) => {
        return models.service.findById(uuid).then((service) => {
          if (!service) return Promise.reject(new Error('unknown uuid'));
          return service.update(input).then(service => {
            if (!input.offerUuids) return service;
            const Op = models.Sequelize.Op;
            return models.offer.findAll({
              where: {
                [Op.or]: input.offerUuids.map(offerUuid => ({uuid: offerUuid}))
              }
            }).then(offers => {
              return service.setOffers(offers);
            }).then(() => service);
          }).then(service => {
            return models.service.findById(service.uuid, {
              include: [models.offer]
            });
          });
        });
      }
    ),
    serviceDelete: combineResolvers(
      can('service:delete'),
      (_, { uuid }) => {
        return models.service.findById(uuid).then((service) => {
          if (!service) return Promise.reject(new Error('unknown uuid'));
          return service.destroy();
        });
      }
    )
  },
  Service: {
    offers: combineResolvers(
      can('offer:read'),
      (services) => services.getOffers()
    )
  }
};

module.exports = resolvers;
