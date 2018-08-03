module.exports = () => [item, base, category];

const base = require('./base');
const category = require('./category');

const item = `
type Item {
    uuid: ID!
    name: String
    description: String
    price: Float
    category: Category
}

input InputItem {
    name: String
    description: String
    price: Float
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
