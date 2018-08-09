const Promise = require('bluebird');
const argon2 = require('argon2');
const { combineResolvers } = require('graphql-resolvers');
const { can } = require('./helpers');
const models = require('../models');
const rp = require('request-promise')
const cheerio = require('cheerio')
const uuid = require('uuid/v4')

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
    recipeCreateWithMarmiton: combineResolvers(
      can('recipe:create'),
      async(_, { url }, {request}) => {
        const recipe = await marmiton(url)
        recipe.uuid = uuid()
        console.log(recipe)
        return recipe
        // if(!input.itemUuids) return recipe
        // const Op = models.Sequelize.Op;
        // return models.item.findAll({
        //   where: {
        //     [Op.or]: input.itemUuids.map(itemUuid => ({ uuid: itemUuid }))
        //   }
        // }).then(items => {
        //   return recipe.setItems(items);
        // }).then(() => models.recipe.findById(recipe.uuid, {
        //   include: [models.item]
        // }));
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
      async (_, { recipeUuid, input }, {request}) => {
        const recipe = await models.recipe.findById(recipeUuid)
        if (!recipe) return Promise.reject(new Error("Unknown recipe"))
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
        await recipe.addItems([item], {
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
      async (_, { recipeUuid, itemUuid }) => {
        const recipe = await models.recipe.findById(recipeUuid, {
          include: {
            model: models.item,
            as: "items"
          }
        })
        if (!recipe) return Promise.reject(new Error("Unknown recipe"))
        recipe.removeItem(itemUuid)
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
        if(!recipe.getItems) return recipe.items
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


function marmiton(url) {
  return rp.get(url).then(data => {
    const $ = cheerio.load(data)
    const name = $('.main-title').text()
    const img = $('.af-pin-it-wrapper').find('img').attr('src')
    const nbPerson = +$('.recipe-ingredients__qt-counter input')[0].attribs.value
    const time = $('.recipe-infos__timmings__total-time span').text()
    const items = $('.recipe-ingredients__list__item').toArray().map(($ingredient) => {
      $ingredient = cheerio.load($.html($ingredient))
      return {
        quantity: $ingredient('.recipe-ingredient-qt').text() || 1,
        name: $ingredient('.ingredient').text()
      }
    })
    const preparation = $('.recipe-preparation__list__item').toArray().map(($preparation, i) => {
      $preparation = cheerio.load($.html($preparation))
      $preparation('h3').remove()
      return `<h3>Etape ${i + 1}</h3>\n<p>${$preparation('.recipe-preparation__list__item').text().trim()}</p>`
    }).join('\n')
    return {
      name,
      img,
      nbPerson,
      time,
      items,
      preparation
    }
  })
}