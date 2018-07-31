module.exports = () => [shoppingList, item, base];

const base = require('./base');
const item = require('./item');

const shoppingList = `
type ShoppingList {
    uuid: ID!
    name: String
    description: String
    createdAt: GraphQLDateTime
    items: [ItemInList]
}

type ItemInList {
    uuid: ID!
    name: String
    description: String
    quantity: Int
    done: Int
}
input InputItemInList {
    name: String
    description: String
    quantity: Int
    done: Int
}

input InputShoppingList {
    name: String
    description: String
    items: [ID]
}

extend type Query {
    shoppingListById(uuid: ID!): ShoppingList
    shoppingLists: [ShoppingList]
}

extend type Mutation {
    shoppingListCreate(input: InputShoppingList!): ShoppingList
    shoppingListUpdate(uuid: ID!, input: InputShoppingList!): ShoppingList
    shoppingListRemoveItem(listUuid: ID!, itemUuid: ID!): Boolean
    shoppingListAddItem(listUuid: ID!, input: InputItemInList!): ItemInList
    shoppingListDelete(uuid: ID!): Boolean
}
`;
