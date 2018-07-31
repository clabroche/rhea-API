module.exports = () => [shoppingList, item, base];

const base = require('./base');
const item = require('./item');

const shoppingList = `
type ShoppingList {
    uuid: ID!
    name: String
    description: String
    items: [Item]
}

input InputShoppingList {
    name: String
    description: String
    itemUuids: [ID]
}

extend type Query {
    shoppingListById(uuid: ID!): ShoppingList
    shoppingLists: [ShoppingList]
}

extend type Mutation {
    shoppingListCreate(input: InputShoppingList!): ShoppingList
    shoppingListUpdate(uuid: ID!, input: InputShoppingList!): ShoppingList
    shoppingListDelete(uuid: ID!): Boolean
}
`;
