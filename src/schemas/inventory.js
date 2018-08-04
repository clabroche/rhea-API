module.exports = () => [inventory, item, base];

const base = require('./base');
const item = require('./item');

const inventory = `
type Inventory {
    uuid: ID!
    items: [ItemInInventory]
}

type ItemInInventory {
    uuid: ID!
    name: String
    description: String
    quantity: Int
    category: Category
}
input InputItemInInventory {
    name: String
    description: String
    quantity: Int
}

extend type Query {
    inventory: Inventory
}

extend type Mutation {
    inventoryRemoveItem(itemUuid: ID!): Boolean
    inventoryAddItem(quantity: Int!, input: InputItemInInventory): ItemInInventory
}
`;
