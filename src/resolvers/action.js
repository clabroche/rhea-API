const { combineResolvers } = require('graphql-resolvers');
const { can } = require('./helpers');
const models = require('../models');

const resolvers = {
  Query: {
    actionById: combineResolvers(
      can('action:read'),
      (_, { uuid }) => models.action.findById(uuid)
    ),
    actions: combineResolvers(
      can('action:read'),
      () => models.action.findAll()
    )
  },
  Action: {
    offer: combineResolvers(
      can('offer:read'),
      (action) => action.getOffer()
    ),
    customer: combineResolvers(
      can('person:read'),
      can('organization:read'),
      (action) => action.getEntity().then(entity => {
        if (!entity) return null;
        return models.entity.findById(entity.uuid, {
          include: [{
            model: models.organization,
            include: [models.entity]
          }, {
            model: models.person,
            include: [models.entity]
          }]
        }).then(entity => {
          if (entity.organization) return entity.organization;
          if (entity.person) return entity.person;
        });
      })
    ),
    planning: combineResolvers(
      can('planAction:read'),
      (action) => action.getPlanActions()
    ),
    location: combineResolvers(
      can('locationAction:read'),
      (action) => action.getLocationActions()
    )
  }
};

module.exports = resolvers;
