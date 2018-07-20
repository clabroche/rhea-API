module.exports = () => [postalAddress, building, base];

const base = require('./base');
const building = require('./building');

const postalAddress = `
# The mailing address
type PostalAddress {
    uuid: ID!
    # The name of the postal address
    name: String
    # The street address. For example, 1600 Amphitheatre Pkwy
    streetAddress: String
    # The postal code. For example, 94043.
    postalCode: String
    # The locality. For example, Mountain View.
    addressLocality: String
    # The latitude of a location. For example 37.42242 (WGS 84).
    latitude: String
    # The longitude of a location. For example -122.08585 (WGS 84).
    longitude: String
    buildings: [Building]
}

input InputPostalAddress {
    name: String
    streetAddress: String
    postalCode: String
    addressLocality: String
    latitude: String
    longitude: String
    buildingUuids: [ID]
}

extend type Query {
    postalAddressById(uuid: ID!): PostalAddress
    postalAddresses: [PostalAddress]
}

extend type Mutation {
    postalAddressCreate(input: InputPostalAddress!): PostalAddress
    postalAddressUpdate(uuid: ID!, input: InputPostalAddress!): PostalAddress
    postalAddressDelete(uuid: ID!): Boolean
}
`;
