const { makeExecutableSchema, mockServer } = require('graphql-tools');
const chai = require('chai');
chai.use(require('chai-uuid'));
const expect = chai.expect;

const userTypeDefs = require('./../../src/schemas/level.js');
const schema = makeExecutableSchema({ typeDefs: [userTypeDefs] });
const myMockServer = mockServer(schema);

describe('src/schemas/level.js', function () {
  it('should return all levels', function () {
    return myMockServer.query(`{
      levels {
        uuid
        code
      }
    }`).then((result) => {
      expect(result).to.be.an('object');
      expect(result).to.have.property('data');
      expect(result).to.have.nested.property('data.levels');
      expect(result.data.levels).to.be.an('array');
      result.data.levels.map(level => {
        expect(level).to.have.all.keys(
          'uuid',
          'code'
        );
        expect(level).to.be.an('object');
        expect(level.uuid).to.be.uuid('v4');
        expect(level.code).to.be.a('string');
      });
    });
  });

  it('should return a level', function () {
    return myMockServer.query(`{
      levelById(uuid:"3ff8e598-c921-4201-a58a-7ce087ca1253") {
        uuid
        code
      }
    }`).then((result) => {
      expect(result).to.be.an('object');
      expect(result).to.have.property('data');
      expect(result).to.have.nested.property('data.levelById');
      expect(result.data.levelById).to.be.an('object');
      const level = result.data.levelById;
      expect(level).to.be.an('object');
      expect(level.uuid).to.be.uuid('v4');
      expect(level.code).to.be.a('string');
    });
  });
});
