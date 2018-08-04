const { combineResolvers } = require('graphql-resolvers');
const { can } = require('./helpers');
const models = require('../models');

const resolvers = {
  Query: {
    inventory: combineResolvers(
      can('inventory:read'),
      (_, { uuid }) => models.inventory.findAll()
    ),
  },
  Mutation: {
    
  },
  Inventory: {
    items: combineResolvers(
      can('inventory:read'),
      (inventory) => {
        console.log(inventory)
        return models.inventoryItem.findAll({
          where: { InventoryUuid: inventory.uuid }
        })
      }
    )
  }
};

module.exports = resolvers;
