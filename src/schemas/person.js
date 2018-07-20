module.exports = () => [person, account, organization, postalAddress, base];

const base = require('./base');
const organization = require('./organization');
const postalAddress = require('./postalAddress');
const account = require('./account');

const person = `
# A person (alive, dead, undead, or fictional)
type Person {
    uuid: ID!
    # The telephone number
    telephone: String
    # Email address
    email: String
    type: EntityType
    # Given name. In the U.S., the first name of a Person. This can be used along with familyName instead of the name property.
    givenName: String
    # Family name. In the U.S., the last name of an Person. This can be used along with givenName instead of the name property.
    familyName: String
    # Gender of the person
    gender: String
    # Physical addresses
    postalAddresses: [PostalAddress]
    # User account
    account: Account
    # Organizations that the person works for
    worksFor: [Organization]
    # An action performed by a direct agent and indirect participants upon a direct object
    actions: [Action]
}

input InputPerson {
    telephone: String
    email: String
    type: EntityType
    givenName: String
    familyName: String
    gender: String
    postalAddresseUuids: [ID]
    worksForUuids: [ID]
}

extend type Query {
    personById(uuid: ID!): Person
    people: [Person]
}

extend type Mutation {
    personCreate(input: InputPerson!): Person
    personUpdate(uuid: ID!, input: InputPerson!): Person
    personDelete(uuid: ID!): Boolean
}
`;
