module.exports = () => [planAction, action, locationAction, person, base];

const base = require('./base');
const action = require('./action');
const person = require('./person');
const locationAction = require('./locationAction');

const planAction = `
# The act of planning the execution of an event/task/action/reservation/plan to a future date
type PlanAction {
    uuid: ID!
    # A description of the item
    description: String
    # The startTime of something. For actions that span a period of time, when the action was performed
    start: GraphQLDateTime
    # The endTime of something. For actions that span a period of time, when the action was performed
    end: GraphQLDateTime
    # The type of the item
    type: ActionType
    # Indicates a Action, which describes an action in which this thing would play an 'object' role
    action: Action
    # The direct performer or driver of the action
    agent: Person
    # The location of where an action takes place
    location: [LocationAction]
    # An PlanAction to which this PlanAction belongs
    parent: PlanAction
}

input InputPlanAction {
    description: String
}

extend type Query {
    planActionById(uuid: ID!): PlanAction
    planActions: [PlanAction]
}
`;
