module.exports = () => [organization, customer, person, postalAddress, offer, action, base];

const base = require('./base');
const person = require('./person');
const postalAddress = require('./postalAddress');
const offer = require('./offer');
const customer = require('./customer');
const action = require('./action');

const organization = `
# An organization such as a school, NGO, corporation, club, etc.
type Organization {
    uuid: ID!
    # The name of the organization
    name: String
    # The telephone number
    telephone: String
    # Email address
    email: String
    type: EntityType
    # An associated logo
    logo: String
    # Physical addresses
    postalAddresses: [PostalAddress]
    # An Organization to which this Organization belongs
    memberOf: Organization
    # Party placing the order or paying the invoice
    customers: [Customer]
    # People working for this organization
    employees: [Person]
    # A pointer to products or services offered by the organization or person
    makesOffer: [Offer]
    # An action performed by a direct agent and indirect participants upon a direct object
    actions: [Action]
}

input InputOrganization {
    name: String
    telephone: String
    email: String
    type: EntityType
    logo: String
    postalAddresseUuids: [ID]
    memberOfUuid: ID
    customerUuids: [ID]
    
}

extend type Query {
    organizationById(uuid: ID!): Organization
    organizations(type: EntityType): [Organization]
}

extend type Mutation {
    organizationCreate(input: InputOrganization!): Organization
    organizationUpdate(uuid: ID!, input: InputOrganization!): Organization
    organizationDelete(uuid: ID!): Boolean
}
`;
