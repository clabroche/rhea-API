const { combineResolvers } = require('graphql-resolvers');
const { can } = require('./helpers');
const models = require('../models');
const Promise = require('bluebird')
const resolvers = {
  Query: {
    calendar: combineResolvers(
      can('calendar:read'),
      (_, { uuid }, {request}) => models.calendar.find({
        where: { accountUuid: request.user.uuid }
      })
    ),
  },
  Mutation: {
    calendarAddRecipe: combineResolvers(
      can('calendar:add'),
      async (_, { recipeUuid, date }, {request}) => {
        const calendar = await models.calendar.find({
          where: { accountUuid: request.user.uuid }
        })
        if (!calendar) return Promise.reject(new Error("Unknown calendar"))
        await models.calendarRecipe.create({
          calendarUuid: calendar.uuid,
          recipeUuid: recipeUuid,
          date
        })
        return models.calendar.find({
          where: { accountUuid: request.user.uuid }
        })

      }
    ),
    calendarRemoveRecipe: combineResolvers(
      can('calendar:remove'),
      async (_, { recipeUuid, date }, {request}) => {
        const calendar = await models.calendar.find({
          where: { accountUuid: request.user.uuid }
        })
        if (!calendar) return Promise.reject(new Error("Unknown calendar"))
        const recipe = await models.calendarRecipe.find({
          where: {
            calendarUuid: calendar.uuid,
            recipeUuid,
            date
          }
        })
        console.log(recipe.destroy())
        return true
      }
    ),
  },
  Calendar: {
    recipes: combineResolvers(
      can('calendar:read'),
      async (calendar) => {
        const calendarRecipes = await models.calendarRecipe.findAll({
          where: {calendarUuid: calendar.uuid}
        })
        if (!calendarRecipes) return null
        return Promise.map(calendarRecipes, async calendarRecipe=>{
          return models.recipe.find({where: {uuid: calendarRecipe.recipeUuid}}).then(recipe=> {
            recipe.date = calendarRecipe.date
            return recipe
          })
        })
      }
    )
  }
};

module.exports = resolvers;
