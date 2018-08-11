module.exports = () => [calendar, item, base];

const base = require('./base');
const item = require('./item');

const calendar = `
type Calendar {
    uuid: ID!
    recipes: [RecipeInCalendar]
}

type RecipeInCalendar {
    uuid: ID!
    date: GraphQLDateTime
    name: String
    preparation: String
    description: String
    createdAt: GraphQLDateTime
    img: String
    nbPerson: Int
    time: String
    items: [ItemInRecipe]
}

extend type Query {
    calendar: Calendar
}

extend type Mutation {
    calendarRemoveRecipe(recipeUuid: ID!): Boolean
    calendarAddRecipe(date: GraphQLDateTime!, recipeUuid: ID!): RecipeInCalendar
}
`;
