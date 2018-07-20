module.exports = () => [service, offer, base];

const base = require('./base');
const offer = require('./offer');

const service = `
# A service provided by an organization, e.g. delivery service, print services, etc.
type Service {
    uuid: ID!
    # The name of the item
    name: String
    # A description of the item
    description: String
    # An offer to provide this item—for example, an offer to sell a product, rent the DVD of a movie, perform a service, or give away tickets to an event
    offers: [Offer]
}

input InputService {
    name: String
    description: String
    offerUuids: [ID]
}

extend type Query {
    serviceById(uuid: ID!): Service
    services: [Service]
}

extend type Mutation {
    serviceCreate(input: InputService!): Service
    serviceUpdate(uuid: ID!, input: InputService!): Service
    serviceDelete(uuid: ID!): Boolean
}
`;
