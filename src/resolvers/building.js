const { combineResolvers } = require('graphql-resolvers');
const { can } = require('./helpers');
const models = require('../models');

const resolvers = {
  Query: {
    buildingById: combineResolvers(
      can('building:read'),
      (_, { uuid }) => models.building.findById(uuid)
    ),
    buildings: combineResolvers(
      can('building:read'),
      () => models.building.findAll()
    )
  },
  Mutation: {
    buildingCreate: combineResolvers(
      can('building:create'),
      (_, { input }) => {
        return models.building.create(input).then(building => {
          if (!input.levelUuids) return building;
          const Op = models.Sequelize.Op;
          return models.level.findAll({
            where: {
              [Op.or]: input.levelUuids.map(levelUuid => ({uuid: levelUuid}))
            }
          }).then(levels => {
            return building.setLevels(levels);
          }).then(() => models.building.findById(building.uuid, {
            include: [models.level]
          }));
        });
      }
    ),
    buildingUpdate: combineResolvers(
      can('building:update'),
      (_, { uuid, input }) => {
        return models.building.findById(uuid).then((building) => {
          if (!building) return Promise.reject(new Error('unknown uuid'));
          return building.update(input);
        }).then(building => {
          if (!input.levelUuids) return building;
          const Op = models.Sequelize.Op;
          return models.level.findAll({
            where: {
              [Op.or]: input.levelUuids.map(levelUuid => ({uuid: levelUuid}))
            }
          }).then(levels => {
            return building.setLevels(levels);
          }).then(() => models.building.findById(building.uuid, {
            include: [models.level]
          }));
        });
      }
    ),
    buildingDelete: combineResolvers(
      can('building:delete'),
      (_, { uuid }) => {
        return models.building.findById(uuid).then((building) => {
          if (!building) return Promise.reject(new Error('unknown uuid'));
          return building.destroy();
        });
      }
    )
  },
  Building: {
    levels: combineResolvers(
      can('level:read'),
      (building) => building.getLevels()
    )
  }
};

module.exports = resolvers;
