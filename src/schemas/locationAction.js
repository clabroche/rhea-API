module.exports = () => [locationAction, action, planAction, postalAddress, building, level, base];

const base = require('./base');
const action = require('./action');
const planAction = require('./planAction');
const postalAddress = require('./postalAddress');
const building = require('./building');
const level = require('./level');

const locationAction = `
# The location of where an action takes plac.
type LocationAction {
    uuid: ID!
    # Indicates a Action, which describes an action in which this thing would play an 'object' role
    action: Action
    # The postal address of where an locationAction takes place
    postalAddress: PostalAddress
    # The building of where an locationAction takes place
    building: Building
    # The level of where an locationAction takes place
    level: Level
    # The act of planning the execution of an action to a future date
    planning: [PlanAction]
}

input InputLocationAction {
    actionUuid: ID
    postalAddressUuid: ID
    buildingUuid: ID
    levelUuid: ID
}

extend type Query {
    locationActionById(uuid: ID!): LocationAction
    locationActions: [LocationAction]
}
`;
