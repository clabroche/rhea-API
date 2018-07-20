const { makeExecutableSchema, mockServer } = require('graphql-tools');
const chai = require('chai');
chai.use(require('chai-uuid'));
const expect = chai.expect;

const userTypeDefs = require('./../../src/schemas/person.js');
const schema = makeExecutableSchema({ typeDefs: [userTypeDefs] });
const myMockServer = mockServer(schema);

describe('src/schemas/person.js', function () {
  it('should return all people', function () {
    return myMockServer.query(`{
      people {
        uuid
        telephone
        email
        type
        givenName
        familyName
        postalAddresses {
          uuid
          name
        }
        gender
        worksFor {
          uuid
          name
        }
      }
    }`).then((result) => {
      expect(result).to.be.an('object');
      expect(result).to.have.property('data');
      expect(result).to.have.nested.property('data.people');
      expect(result.data.people).to.be.an('array');
      result.data.people.map(person => {
        expect(person).to.have.all.keys(
          'uuid',
          'telephone',
          'email',
          'type',
          'givenName',
          'familyName',
          'postalAddresses',
          'gender',
          'worksFor'
        );
        expect(person).to.be.an('object');
        expect(person.uuid).to.be.uuid('v4');
        expect(person.telephone).to.be.a('string');
        expect(person.email).to.be.a('string');
        expect(person.type).to.be.a('string');
        expect(person.givenName).to.be.a('string');
        expect(person.familyName).to.be.a('string');
        expect(person.postalAddresses).to.be.a('array');
        expect(person.gender).to.be.a('string');
        expect(person.worksFor).to.be.a('array');
      });
    });
  });

  it('should return a person', function () {
    return myMockServer.query(`{
      personById(uuid:"3ff8e598-c921-4201-a58a-7ce087ca1253") {
        uuid
        telephone
        email
        type
        givenName
        familyName
        postalAddresses {
          uuid
          name
        }
        gender
        worksFor {
          uuid
          name
        }
      }
    }`).then((result) => {
      expect(result).to.be.an('object');
      expect(result).to.have.property('data');
      expect(result).to.have.nested.property('data.personById');
      expect(result.data.personById).to.be.an('object');
      const person = result.data.personById;
      expect(person).to.have.all.keys(
        'uuid',
        'telephone',
        'email',
        'type',
        'givenName',
        'familyName',
        'postalAddresses',
        'gender',
        'worksFor'
      );
      expect(person).to.be.an('object');
      expect(person.uuid).to.be.uuid('v4');
      expect(person.telephone).to.be.a('string');
      expect(person.email).to.be.a('string');
      expect(person.type).to.be.a('string');
      expect(person.givenName).to.be.a('string');
      expect(person.familyName).to.be.a('string');
      expect(person.postalAddresses).to.be.a('array');
      expect(person.gender).to.be.a('string');
      expect(person.worksFor).to.be.a('array');
    });
  });
});
