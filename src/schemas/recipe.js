module.exports = () => [recipe, item, base];

const base = require('./base');
const item = require('./item');

const recipe = `
type Recipe {
    uuid: ID!
    name: String
    description: String
    createdAt: GraphQLDateTime
    items: [ItemInRecipe]
}

type ItemInRecipe {
    uuid: ID!
    name: String
    description: String
    quantity: Int
    price: Float
    category: Category
}
input InputItemInRecipe {
    name: String
    description: String
    quantity: Int
    price: Float
}

input InputRecipe {
    name: String
    description: String
    items: [ID]
}

extend type Query {
    recipeById(uuid: ID!): Recipe
    recipes: [Recipe]
}

extend type Mutation {
    recipeCreate(input: InputRecipe!): Recipe
    recipeUpdate(uuid: ID!, input: InputRecipe!): Recipe
    recipeRemoveItem(listUuid: ID!, itemUuid: ID!): Boolean
    recipeAddItem(listUuid: ID!, input: InputItemInRecipe!): ItemInRecipe
    recipeDelete(uuid: ID!): Boolean
}
`;
