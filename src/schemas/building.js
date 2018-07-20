module.exports = () => [building, level, base];

const base = require('./base');
const level = require('./level');

const building = `
type Building {
    uuid: ID!
    name: String
    type: String
    color: String
    latitude: String
    longitude: String
    levels: [Level]
}

input InputBuilding {
    name: String
    type: String
    color: String
    latitude: String
    longitude: String
    levelUuids: [ID]
}

extend type Query {
    buildingById(uuid: ID!): Building
    buildings: [Building]
}

extend type Mutation {
    buildingCreate(input: InputBuilding!): Building
    buildingUpdate(uuid: ID!, input: InputBuilding!): Building
    buildingDelete(uuid: ID!): Boolean
}
`;
