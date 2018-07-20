const { combineResolvers } = require('graphql-resolvers');
const { can } = require('./helpers');
const models = require('../models');

const resolvers = {
  Query: {
    planActionById: combineResolvers(
      can('planAction:read'),
      (_, { uuid }) => models.planAction.findById(uuid)
    ),
    planActions: combineResolvers(
      can('planAction:read'),
      () => models.planAction.findAll()
    )
  },
  PlanAction: {
    action: combineResolvers(
      can('action:read'),
      (planAction) => planAction.getAction()
    ),
    agent: combineResolvers(
      can('person:read'),
      (planAction) => planAction.getPerson().then(person => {
        if (!person) return null;
        return models.person.findById(person.uuid, {
          include: [models.entity]
        });
      })
    ),
    location: combineResolvers(
      can('locationAction:read'),
      (planAction) => planAction.getLocationActions()
    ),
    parent: combineResolvers(
      can('planAction:read'),
      (planAction) => planAction.getParentPlanAction()
    )
  }
};

module.exports = resolvers;
