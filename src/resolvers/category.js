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
      async (_, { input }) => {
        const existingCategory = (await models.category.findAll({
          where: { name: input.name }
        })).pop();
        if (existingCategory) return existingCategory;
        const category = await models.category.create(input);
        return models.category.findById(category.uuid);
      }
    ),
    categoryUpdate: combineResolvers(
      can('role:update'),
      async (_, { uuid, input }) => {
        await models.category.update(input, {where: { uuid }});
        return models.category.findById(uuid)
      }
    ),
    categoryDelete: combineResolvers(
      can('role:delete'),
      async (_, { uuid }) => {
        const category = await models.category.findById(uuid)
        if (!category) return Promise.reject(new Error('Unknown uuid'));
        return category.destroy();
      }
    )
  }
};

module.exports = resolvers;
