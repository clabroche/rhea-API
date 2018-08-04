const Promise = require('bluebird');
const argon2 = require('argon2');
const { combineResolvers } = require('graphql-resolvers');
const { can } = require('./helpers');
const models = require('../models');

const resolvers = {
  Query: {
    itemById: combineResolvers(
      can('item:read'),
      (_, { uuid }) => models.item.findById(uuid)
    ),
    items: combineResolvers(
      can('item:read'),
      () => models.item.findAll()
    )
  },
  Mutation: {
    itemCreate: combineResolvers(
      can('item:create'),
      async (_, { input }) => {
        const existingItem = (await models.item.findAll({
          where: {
            name: input.name
          }
        })).pop();
        if (existingItem) return existingItem;
        const item = await models.item.create(input);
        return models.item.findById(item.uuid);
      }
    ),
    itemUpdate: combineResolvers(
      can('item:update'),
      async (_, { uuid, input }) => {
        const item = await models.item.findById(uuid)
        if (!item) return Promise.reject(new Error('Unknown uuid'));
        await item.update(input)
        return models.item.findById(uuid);
      }
    ),
    itemDelete: combineResolvers(
      can('item:delete'),
      async (_, { uuid }) => {
        const item = await models.item.findById(uuid)
        if (!item) return Promise.reject(new Error('Unknown uuid'));
        return item.destroy();
      }
    )
  },
  Item: {
    category: combineResolvers(
      can('category:read'),
      (category) => {
        return models.category.findById(category.categoryUuid)
      }
    )
  }
};

module.exports = resolvers;
