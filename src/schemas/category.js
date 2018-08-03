module.exports = () => [category, base, item];

const base = require('./base');
const item = require('./item');

const category = `
type Category {
    uuid: ID!
    name: String
    items: [Item]
}

input InputCategory {
    name: String
    itemUuids: [ID]
}

extend type Query {
    categoryById(uuid: ID!): Category
    categories: [Category]
}
extend type Mutation {
    categoryCreate(input: InputCategory!): Category
    categoryUpdate(uuid: ID!, input: InputCategory!): Category
    categoryDelete(uuid: ID!): Boolean
}
`;
