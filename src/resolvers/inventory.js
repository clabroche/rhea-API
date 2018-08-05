const { combineResolvers } = require('graphql-resolvers');
const { can } = require('./helpers');
const models = require('../models');

const resolvers = {
  Query: {
    inventory: combineResolvers(
      can('inventory:read'),
      (_, { uuid }, {request}) => models.inventory.find({
        where: { accountUuid: request.user.uuid }
      })
    ),
  },
  Mutation: {
    inventoryAddItem: combineResolvers(
      can('inventory:add'),
      async (_, { listUuid, input }, {request}) => {
        const list = (await models.inventory.find({
          where: { accountUuid: request.user.uuid }
        }))
        if (!list) return Promise.reject(new Error("Unknown inventory"))
        let item = (await models.item.findAll({
          where: { name: input.name }
        })).pop();
        if (!item) {
          input.accountUuid = request.user.uuid
          item = await models.item.create(input)
        }
        else item.update(input);
        if (!item) return new Error("Can't add item")
        if (!input.quantity) input.quantity = 0
        await list.addItems([item], {
          through: {
            quantity: input.quantity,
         }
        });

        return models.inventoryItem.find({
          where: { itemUuid: item.uuid },
        }).then(data => {
          data.uuid = data.itemUuid
          return data
        })
      }
    ),
    inventoryRemoveItem: combineResolvers(
      can('inventory:remove'),
      async (_, { itemUuid }, {request}) => {
        console.log(itemUuid)
        const list = (await models.inventory.find({
          include: { model: models.item, as: "items" }
        }))[0]
        if (!list) return Promise.reject(new Error("Unknown inventory"))
        list.removeItem(itemUuid)
        return true
      }
    ),
  },
  Inventory: {
    items: combineResolvers(
      can('inventory:read'),
      (inventory) => {
        return inventory.getItems( {
          through: {items: "quantity"}
        }).then(data => {
          data.map(({ inventoryItem }, i)=>{
            data[i].quantity = inventoryItem.quantity
            data[i].done = inventoryItem.done
          })
          return data
        })
      }
    )
  }
};

module.exports = resolvers;
