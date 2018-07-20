const { combineResolvers } = require('graphql-resolvers');
const { can } = require('./helpers');
const models = require('../models');

const resolvers = {
  Query: {
    levelById: combineResolvers(
      can('level:read'),
      (_, { uuid }) => models.level.findById(uuid)
    ),
    levels: combineResolvers(
      can('level:read'),
      () => models.level.findAll()
    )
  },
  Mutation: {
    levelCreate: combineResolvers(
      can('level:create'),
      (_, { input }) => models.level.create(input)
    ),
    levelUpdate: combineResolvers(
      can('level:update'),
      (_, { uuid, input }) => {
        return models.level.findById(uuid).then((level) => {
          if (!level) return Promise.reject(new Error('unknown uuid'));
          return level.update(input);
        });
      }
    ),
    levelDelete: combineResolvers(
      can('level:delete'),
      (_, { uuid }) => {
        return models.level.findById(uuid).then((level) => {
          if (!level) return Promise.reject(new Error('unknown uuid'));
          return level.destroy();
        });
      }
    )
  }
};

module.exports = resolvers;
