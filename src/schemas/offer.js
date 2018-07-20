module.exports = () => [offer, organization, service, base];

const base = require('./base');
const organization = require('./organization');
const service = require('./service');

const offer = `
"""
An offer to transfer some rights to an item or to provide a service.
For example, an offer to sell tickets to an event, to rent the DVD of a movie, to stream a TV show over the internet, to repair a motorcycle, or to loan a book. 
"""
type Offer {
    uuid: ID!
    # The beginning of the availability of the product or service included in the offer.
    aviabilyStarts: GraphQLDate
    # The end of the availability of the product or service included in the offer.
    aviabilyEnds: GraphQLDate
    # The offer price of a product and/or a service
    price: Float
    # A category for the item
    category: String
    # A color for the item
    color: String
    # A marker for the item
    marker: String
    # A pointer to the organization or person making the offer
    offeredBy: Organization
    # The item being offered
    services: [Service]
}

input InputOffer {
    aviabilyStarts: GraphQLDate
    aviabilyEnds: GraphQLDate
    price: Float
    category: String
    color: String
    marker: String
    offeredByUuid: ID
    serviceUuids: [ID]
}

extend type Query {
    offerById(uuid: ID!): Offer
    offers: [Offer]
}

extend type Mutation {
    offerCreate(input: InputOffer!): Offer
    offerUpdate(uuid: ID!, input: InputOffer!): Offer
    offerDelete(uuid: ID!): Boolean
}
`;
