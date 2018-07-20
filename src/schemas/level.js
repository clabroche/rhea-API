module.exports = () => [level, base];

const base = require('./base');

const level = `
type Level {
    uuid: ID!
    code: String
}

input InputLevel {
    code: String
}

extend type Query {
    levelById(uuid: ID!): Level
    levels: [Level]
}

extend type Mutation {
    levelCreate(input: InputLevel!): Level
    levelUpdate(uuid: ID!, input: InputLevel!): Level
    levelDelete(uuid: ID!): Boolean
}
`;
