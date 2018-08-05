const Promise = require('bluebird');
const argon2 = require('argon2');
const { combineResolvers } = require('graphql-resolvers');
const { can } = require('./helpers');
const models = require('../models');

const resolvers = {
  Query: {
    recipeById: combineResolvers(
      can('recipe:read'),
      (_, { uuid }) => {
        return models.recipe.findById(uuid, {
          include: {
            model: models.item,
            as: 'items'
          }
        })
      }
    ),
    recipes: combineResolvers(
      can('recipe:read'),
      (_, arg, {request}) => models.recipe.findAll({
        where: { accountUuid: request.user.uuid }
      })
    )
  },
  Mutation: {
    recipeCreate: combineResolvers(
      can('recipe:create'),
      async(_, { input }, {request}) => {
        if (!request.user.uuid) return Promise.reject(new Error('Cannot determine user'))
        input.accountUuid = request.user.uuid;
        const recipe = await models.recipe.create(input)
        if(!input.itemUuids) return recipe
        const Op = models.Sequelize.Op;
        return models.item.findAll({
          where: {
            [Op.or]: input.itemUuids.map(itemUuid => ({ uuid: itemUuid }))
          }
        }).then(items => {
          return recipe.setItems(items);
        }).then(() => models.recipe.findById(recipe.uuid, {
          include: [models.item]
        }));
      }
    ),
    recipeUpdate: combineResolvers(
      can('recipe:update'),
      async (_, { uuid, input }) => {
        const recipe = await models.recipe.findById(uuid)
        if (!recipe) return Promise.reject(new Error('Unknown uuid'));
        await recipe.update(input)
        return models.recipe.findById(uuid);
      }
    ),
    recipeAddItem: combineResolvers(
      can('recipe:add'),
      async (_, { listUuid, input }, {request}) => {
        const list = await models.recipe.findById(listUuid)
        if (!list) return Promise.reject(new Error("Unknown recipe"))
        let item = (await models.item.findAll({
          where: { name: input.name, accountUuid: request.user.uuid}
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
            done: input.done,
            price: input.price
         }
        });

        return models.recipeItem.find({
          where: { itemUuid: item.uuid },
        }).then(data => {
          data.uuid = data.itemUuid
          return data
        })
      }
    ),
    recipeRemoveItem: combineResolvers(
      can('recipe:remove'),
      async (_, { listUuid, itemUuid }) => {
        const list = await models.recipe.findById(listUuid, {
          include: {
            model: models.item,
            as: "items"
          }
        })
        if (!list) return Promise.reject(new Error("Unknown recipe"))
        list.removeItem(itemUuid)
        return true
      }
    ),
    recipeDelete: combineResolvers(
      can('recipe:delete'),
      async (_, { uuid }) => {
        const recipe = await models.recipe.findById(uuid)
        if (!recipe) return Promise.reject(new Error('Unknown uuid'));
        return recipe.destroy();
      }
    )
  },
  Recipe: {
    items: combineResolvers(
      can('item:read'),
      (recipe) => {
        return recipe.getItems( {
          through: {items: "quantity"}
        }).then(data => {
          data.map(({ recipeItem }, i)=>{
            data[i].quantity = recipeItem.quantity
            data[i].done = recipeItem.done
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
