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
        include: {
          model: models.item,
          as: 'items'
        }
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
    shoppingListAddItem: combineResolvers(
      can('shoppingList:add'),
      async (_, { listUuid, input }) => {
        const list = await models.shoppingList.findById(listUuid)
        if (!list) return Promise.reject(new Error("Unknown shoppingList"))
        let item;
        item = await models.item.create(input).catch(async err => {
          let item = await models.item.find({
            where: { name: input.name },
          })
          return item.update(input);
        })
        if (!item) return new Error("Can't add item")
        if (!input.done) input.done = 0
        if (input.done > input.quantity) input.done = 0
        if (input.done < 0) input.done = 0
        if (input.quantity < 0) input.quantity = 0
        await list.addItems([item], {
          through: {
            quantity: input.quantity,
            done: input.done,
            price: input.price
         }
        });

        return models.shoppingListItem.find({
          where: { itemUuid: item.uuid },
        }).then(data => {
          data.uuid = data.itemUuid
          return data
        })
      }
    ),
    shoppingListRemoveItem: combineResolvers(
      can('shoppingList:remove'),
      async (_, { listUuid, itemUuid }) => {
        const list = await models.shoppingList.findById(listUuid, {
          include: {
            model: models.item,
            as: "items"
          }
        })
        if (!list) return Promise.reject(new Error("Unknown shoppingList"))
        list.removeItem(itemUuid)
        return true
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
      can('item:read'),
      (shoppingList) => {
        return shoppingList.getItems( {
          through: {items: "quantity"}
        }).then(data => {
          data.map(({ shoppingListItem }, i)=>{
            data[i].quantity = shoppingListItem.quantity
            data[i].done = shoppingListItem.done
          })
          return data
        })
      }
    )
  },
  ItemInList: {
    category: combineResolvers(
      can('category:read'),
      (category) => {
        return models.category.findById(category.categoryUuid)
      }
    )
  }
};

module.exports = resolvers;
