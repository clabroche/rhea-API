const { combineResolvers } = require('graphql-resolvers');
const { can } = require('./helpers');
const models = require('../models');

const resolvers = {
  Query: {
    postalAddressById: combineResolvers(
      can('postalAddress:read'),
      (_, { uuid }) => models.postalAddress.findById(uuid)
    ),
    postalAddresses: combineResolvers(
      can('postalAddress:read'),
      () => models.postalAddress.findAll()
    )
  },
  Mutation: {
    postalAddressCreate: combineResolvers(
      can('postalAddress:create'),
      (_, { input }) => {
        return models.postalAddress.create(input).then(postalAddress => {
          if (!input.buildingUuids) return postalAddress;
          const Op = models.Sequelize.Op;
          return models.building.findAll({
            where: {
              [Op.or]: input.buildingUuids.map(buildingUuid => ({uuid: buildingUuid}))
            }
          }).then(buildings => {
            return postalAddress.setBuildings(buildings);
          }).then(() => models.postalAddress.findById(postalAddress.uuid, {
            include: [models.building]
          }));
        });
      }
    ),
    postalAddressUpdate: combineResolvers(
      can('postalAddress:update'),
      (_, { uuid, input }) => {
        return models.postalAddress.findById(uuid).then((postalAddress) => {
          if (!postalAddress) return Promise.reject(new Error('unknown uuid'));
          return postalAddress.update(input);
        }).then(postalAddress => {
          if (!input.buildingUuids) return postalAddress;
          const Op = models.Sequelize.Op;
          return models.building.findAll({
            where: {
              [Op.or]: input.buildingUuids.map(buildingUuid => ({uuid: buildingUuid}))
            }
          }).then(buildings => {
            return postalAddress.setBuildings(buildings);
          }).then(() => models.postalAddress.findById(postalAddress.uuid, {
            include: [models.building]
          }));
        });
      }
    ),
    postalAddressDelete: combineResolvers(
      can('postalAddress:delete'),
      (_, { uuid }) => {
        return models.postalAddress.findById(uuid).then((postalAddress) => {
          if (!postalAddress) return Promise.reject(new Error('unknown uuid'));
          return postalAddress.destroy();
        });
      }
    )
  },
  PostalAddress: {
    buildings: combineResolvers(
      can('building:read'),
      (postalAddress) => postalAddress.getBuildings()
    )
  }
};

module.exports = resolvers;
