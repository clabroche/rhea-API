const Promise = require('bluebird');
const argon2 = require('argon2');
const { combineResolvers } = require('graphql-resolvers');
const { can } = require('./helpers');
const models = require('../models');

const resolvers = {
  Query: {
    shoppingListById: combineResolvers(
      can('shoppingList:read'),
      (_, { uuid }) => models.shoppingList.findById(uuid, itemOptions)
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
          console.log(models.shoppingListItem)
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
    shoppingListAddItem: combineResolvers(
      can('shoppingList:addItem'),
      async (_, { listUuid, input }) => {
        const list = await models.shoppingList.findById(listUuid)
        if (!list) return Promise.reject(new Error("Unknown shoppingList"))
        let item;
        item = await models.item.create(input).catch(async err => {
          return await models.item.find({
            where: { name: input.name },
          })
        })
        if (!item) return new Error("Can't add item")
        await list.addItems([item], {
          through: { quantity: input.quantity }
        })
        return models.shoppingList.findById(listUuid)
      }
    ),
    shoppingListRemoveItem: combineResolvers(
      can('shoppingList:addItem'),
      async (_, { listUuid, itemUuid }) => {
        const list = await models.shoppingList.findById(listUuid, {
          include: {
            model: models.item,
            as: "items"
          }
        })
        if (!list) return Promise.reject(new Error("Unknown shoppingList"))
        list.removeItem(itemUuid)
        return models.shoppingList.findById(listUuid)
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
      (shoppingList) => {
        return shoppingList.getItems( {
          through: {items: "quantity"}
        }).then(data => {
          const a = data.map(({ shoppingListItem }, i)=>{
            data[i].quantity = shoppingListItem.quantity
          })
          return data
        })
      }
    )
  }
};

module.exports = resolvers;
