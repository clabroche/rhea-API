const { combineResolvers } = require('graphql-resolvers');
const { can } = require('./helpers');
const models = require('../models');

const resolvers = {
  Query: {
    categoryById: combineResolvers(
      can('category:read'),
      (_, { uuid }) => models.category.findById(uuid)
    ),
    categories: combineResolvers(
      can('category:read'),
      () => models.category.findAll()
    )
  },
  Mutation: {
    categoryCreate: combineResolvers(
      can('role:create'),
      (_, { input }) => {
        return models.category.create(input)
      }
    )
  }
};

module.exports = resolvers;
