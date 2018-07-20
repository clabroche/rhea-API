const { combineResolvers } = require('graphql-resolvers');
const { can } = require('./helpers');
const models = require('../models');

const resolvers = {
  Query: {
    offerById: combineResolvers(
      can('offer:read'),
      (_, { uuid }) => models.offer.findById(uuid)
    ),
    offers: combineResolvers(
      can('offer:read'),
      () => models.offer.findAll()
    )
  },
  Mutation: {
    offerCreate: combineResolvers(
      can('offer:create'),
      (_, { input }) => {
        return models.offer.create(input).then(offer => {
          if (!input.offeredByUuid) return offer;
          return models.organization.findById(input.offeredByUuid)
            .then(organization => offer.setOrganization(organization));
        }).then(offer => {
          if (!input.serviceUuids) return offer;
          const Op = models.Sequelize.Op;
          return models.service.findAll({
            where: {
              [Op.or]: input.serviceUuids.map(serviceUuid => ({uuid: serviceUuid}))
            }
          }).then(services => {
            return offer.addServices(services);
          }).then(() => offer);
        }).then(offer => {
          return models.offer.findById(offer.uuid, {
            include: [models.service, models.organization]
          });
        });
      }
    ),
    offerUpdate: combineResolvers(
      can('offer:update'),
      (_, { uuid, input }) => {
        return models.offer.findById(uuid).then((offer) => {
          if (!offer) return Promise.reject(new Error('unknown uuid'));
          return offer.update(input).then(offer => {
            if (!input.offeredByUuid) return offer;
            return models.organization.findById(input.offeredByUuid)
              .then(organization => offer.setOrganization(organization));
          }).then(offer => {
            if (!input.serviceUuids) return offer;
            const Op = models.Sequelize.Op;
            return models.service.findAll({
              where: {
                [Op.or]: input.serviceUuids.map(serviceUuid => ({uuid: serviceUuid}))
              }
            }).then(services => {
              return offer.setServices(services);
            }).then(() => offer);
          }).then(offer => {
            return models.offer.findById(offer.uuid, {
              include: [models.service, models.organization]
            });
          });
        });
      }
    ),
    offerDelete: combineResolvers(
      can('offer:delete'),
      (_, { uuid }) => {
        return models.offer.findById(uuid).then((offer) => {
          if (!offer) return Promise.reject(new Error('unknown uuid'));
          return offer.destroy();
        });
      }
    )
  },
  Offer: {
    services: combineResolvers(
      can('service:read'),
      (offer) => offer.getServices()
    ),
    offeredBy: combineResolvers(
      can('organization:read'),
      (offer) => offer.getOrganization().then(organization => {
        if (!organization) return null;
        return models.organization.findById(organization.uuid, {
          include: [models.entity]
        });
      })
    )
  }
};

module.exports = resolvers;
