module.exports = () => [item, base];

const base = require('./base');

const item = `
type Item {
    uuid: ID!
    name: String
    description: String
}

input InputItem {
    name: String
    description: String
}

extend type Query {
    itemById(uuid: ID!): Item
    items: [Item]
}

extend type Mutation {
    itemCreate(input: InputItem!): Item
    itemUpdate(uuid: ID!, input: InputItem!): Item
    itemDelete(uuid: ID!): Boolean
}
`;
