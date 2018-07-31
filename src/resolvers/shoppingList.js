const Promise = require('bluebird');
const argon2 = require('argon2');
const { combineResolvers } = require('graphql-resolvers');
const { can } = require('./helpers');
const models = require('../models');

const resolvers = {
  Query: {
    shoppingListById: combineResolvers(
      can('shoppingList:read'),
      (_, { uuid }) => models.shoppingList.findById(uuid, {
        include: [models.item]
      })
    ),
    shoppingLists: combineResolvers(
      can('shoppingList:read'),
      () => models.shoppingList.findAll()
    )
  },
  Mutation: {
    shoppingListCreate: combineResolvers(
      can('shoppingList:create'),
      async(_, { input }) => {
        const shoppingList = await models.shoppingList.create(input)
        if(!input.itemUuids) return shoppingList
        const Op = models.Sequelize.Op;
        return models.item.findAll({
          where: {
            [Op.or]: input.itemUuids.map(itemUuid => ({ uuid: itemUuid }))
          }
        }).then(items => {
          return shoppingList.setItems(items);
        }).then(() => models.shoppingList.findById(shoppingList.uuid, {
          include: [models.item]
        }));
      }
    ),
    shoppingListUpdate: combineResolvers(
      can('shoppingList:update'),
      async (_, { uuid, input }) => {
        const shoppingList = await models.shoppingList.findById(uuid)
        if (!shoppingList) return Promise.reject(new Error('Unknown uuid'));
        await shoppingList.update(input)
        return models.shoppingList.findById(uuid);
      }
    ),
    shoppingListDelete: combineResolvers(
      can('shoppingList:delete'),
      async (_, { uuid }) => {
        const shoppingList = await models.shoppingList.findById(uuid)
        if (!shoppingList) return Promise.reject(new Error('Unknown uuid'));
        return shoppingList.destroy();
      }
    )
  },
  ShoppingList: {
    items: combineResolvers(
      can('items:read'),
      (shoppingList) => shoppingList.getItems()
    )
  }
};

module.exports = resolvers;
