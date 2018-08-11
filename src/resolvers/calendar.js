const { combineResolvers } = require('graphql-resolvers');
const { can } = require('./helpers');
const models = require('../models');

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
        const calendar = (await models.calendar.find({
          where: { accountUuid: request.user.uuid }
        }))
        if (!calendar) return Promise.reject(new Error("Unknown calendar"))
        console.log(recipeUuid, date)
        return
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
        await calendar.addItems([item], {
          through: {
            quantity: input.quantity,
         }
        });

        return models.calendarItem.find({
          where: { itemUuid: item.uuid },
        }).then(data => {
          data.uuid = data.itemUuid
          return data
        })
      }
    ),
    calendarRemoveRecipe: combineResolvers(
      can('calendar:remove'),
      async (_, { itemUuid }, {request}) => {
        const calendar = (await models.calendar.find({
          include: { model: models.item, as: "items" }
        }))[0]
        if (!calendar) return Promise.reject(new Error("Unknown calendar"))
        calendar.removeItem(itemUuid)
        return true
      }
    ),
  },
  Calendar: {
    recipes: combineResolvers(
      can('calendar:read'),
      (calendar) => {
        return calendar.getRecipes( {
          through: {recipes: "date"}
        }).then(data => {
          data.map(({ calendarItem }, i)=>{
            data[i].date = calendarItem.date
          })
          return data
        })
      }
    )
  }
};

module.exports = resolvers;
