module.exports = () => [account, role, person, base];

const base = require('./base');
const person = require('./person');
const role = require('./role');

const account = `
type Account {
    uuid: ID!
    login: String
    password: String
    avatar: String
    user: Person
    role: Role
}

input InputAccount {
    login: String
    password: String
    avatar: String
    user: InputPerson
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
