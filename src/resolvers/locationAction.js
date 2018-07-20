const { combineResolvers } = require('graphql-resolvers');
const { can } = require('./helpers');
const models = require('../models');

const resolvers = {
  Query: {
    locationActionById: combineResolvers(
      can('locationAction:read'),
      (_, { uuid }) => models.locationAction.findById(uuid)
    ),
    locationActions: combineResolvers(
      can('locationAction:read'),
      () => models.locationAction.findAll()
    )
  },
  LocationAction: {
    action: combineResolvers(
      can('action:read'),
      (locationAction) => locationAction.getAction()
    ),
    postalAddress: combineResolvers(
      can('postalAddress:read'),
      (locationAction) => locationAction.getPostalAddress()
    ),
    building: combineResolvers(
      can('building:read'),
      (locationAction) => locationAction.getBuilding()
    ),
    level: combineResolvers(
      can('level:read'),
      (locationAction) => locationAction.getLevel()
    ),
    planning: combineResolvers(
      can('locationAction:read'),
      (locationAction) => locationAction.getPlanActions()
    )
  }
};

module.exports = resolvers;
