const { makeExecutableSchema, mockServer } = require('graphql-tools');
const chai = require('chai');
chai.use(require('chai-uuid'));
const expect = chai.expect;

const userTypeDefs = require('./../../src/schemas/building.js');
const schema = makeExecutableSchema({ typeDefs: [userTypeDefs] });
const myMockServer = mockServer(schema);

describe('src/schemas/building.js', function () {
  it('should return all buildings', function () {
    return myMockServer.query(`{
      buildings {
        uuid
        name
        type
        latitude
        longitude
        levels {
          uuid
          code
        }
      }
    }`).then((result) => {
      expect(result).to.be.an('object');
      expect(result).to.have.property('data');
      expect(result).to.have.nested.property('data.buildings');
      expect(result.data.buildings).to.be.an('array');
      result.data.buildings.map(building => {
        expect(building).to.have.all.keys(
          'uuid',
          'name',
          'type',
          'latitude',
          'longitude',
          'levels'
        );
        expect(building).to.be.an('object');
        expect(building.uuid).to.be.uuid('v4');
        expect(building.name).to.be.a('string');
        expect(building.type).to.be.a('string');
        expect(building.latitude).to.be.a('string');
        expect(building.longitude).to.be.a('string');
        expect(building.levels).to.be.a('array');
      });
    });
  });

  it('should return a building', function () {
    return myMockServer.query(`{
      buildingById(uuid:"3ff8e598-c921-4201-a58a-7ce087ca1253") {
        uuid
        name
        type
        latitude
        longitude
        levels {
          uuid
          code
        }
      }
    }`).then((result) => {
      expect(result).to.be.an('object');
      expect(result).to.have.property('data');
      expect(result).to.have.nested.property('data.buildingById');
      expect(result.data.buildingById).to.be.an('object');
      const building = result.data.buildingById;
      expect(building).to.have.all.keys(
        'uuid',
        'name',
        'type',
        'latitude',
        'longitude',
        'levels'
      );
      expect(building).to.be.an('object');
      expect(building.uuid).to.be.uuid('v4');
      expect(building.name).to.be.a('string');
      expect(building.type).to.be.a('string');
      expect(building.latitude).to.be.a('string');
      expect(building.longitude).to.be.a('string');
      expect(building.levels).to.be.a('array');
    });
  });
});
