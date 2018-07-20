module.exports = () => [action, customer, offer, planAction, locationAction, base];

const base = require('./base');
const customer = require('./customer');
const offer = require('./offer');
const planAction = require('./planAction');
const locationAction = require('./locationAction');

const action = `
# An action performed by a direct agent and indirect participants upon a direct object
type Action {
    uuid: ID!
    # A description of the item
    description: String
    # Party placing the order or paying the invoice
    customer: Customer
    # An offer to transfer some rights to an item or to provide a service
    offer: Offer
    # The act of planning the execution of an action to a future date
    planning: [PlanAction]
    # The location of where an action takes place
    location: [LocationAction]
}

input InputAction {
    description: String
    customerUuid: ID
    offerUuid: ID
    planningUuids: [ID]
    locationUuids: [ID]
}

extend type Query {
    actionById(uuid: ID!): Action
    actions: [Action]
}
`;
