module.exports = () => [account, role, base];

const role = require('./role');
const base = require('./base');

const account = `
type Account {
    uuid: ID!
    login: String
    password: String
    givenName: String
    familyName: String
    avatar: String
    role: Role
}

input InputAccount {
    login: String
    password: String
    givenName: String
    familyName: String
    avatar: String
    roleUuid: ID
}

extend type Query {
    accountById(uuid: ID!): Account
    accounts: [Account]
}

extend type Mutation {
    accountCreate(input: InputAccount!): Account
    accountUpdate(uuid: ID!, input: InputAccount!): Account
    accountDelete(uuid: ID!): Boolean
}
`;
