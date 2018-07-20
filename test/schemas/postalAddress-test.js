const { makeExecutableSchema, mockServer } = require('graphql-tools');
const chai = require('chai');
chai.use(require('chai-uuid'));
const expect = chai.expect;

const userTypeDefs = require('./../../src/schemas/postalAddress.js');
const schema = makeExecutableSchema({ typeDefs: [userTypeDefs] });
const myMockServer = mockServer(schema);

describe('src/schemas/postalAddress.js', function () {
  it('should return all postalAddresses', function () {
    return myMockServer.query(`{
      postalAddresses {
        uuid
        name
        streetAddress
        postalCode
        addressLocality
        latitude
        longitude
        buildings {
          uuid
          name
        }
      }
    }`).then((result) => {
      expect(result).to.be.an('object');
      expect(result).to.have.property('data');
      expect(result).to.have.nested.property('data.postalAddresses');
      expect(result.data.postalAddresses).to.be.an('array');
      result.data.postalAddresses.map(postalAddress => {
        expect(postalAddress).to.have.all.keys(
          'uuid',
          'name',
          'streetAddress',
          'postalCode',
          'addressLocality',
          'latitude',
          'longitude',
          'buildings'
        );
        expect(postalAddress).to.be.an('object');
        expect(postalAddress.uuid).to.be.uuid('v4');
        expect(postalAddress.name).to.be.a('string');
        expect(postalAddress.streetAddress).to.be.a('string');
        expect(postalAddress.postalCode).to.be.a('string');
        expect(postalAddress.addressLocality).to.be.a('string');
        expect(postalAddress.latitude).to.be.a('string');
        expect(postalAddress.longitude).to.be.a('string');
        expect(postalAddress.buildings).to.be.a('array');
      });
    });
  });

  it('should return a postalAddress', function () {
    return myMockServer.query(`{
      postalAddressById(uuid:"3ff8e598-c921-4201-a58a-7ce087ca1253") {
        uuid
        name
        streetAddress
        postalCode
        addressLocality
        latitude
        longitude
        buildings {
          uuid
          name
        }
      }
    }`).then((result) => {
      expect(result).to.be.an('object');
      expect(result).to.have.property('data');
      expect(result).to.have.nested.property('data.postalAddressById');
      expect(result.data.postalAddressById).to.be.an('object');
      const postalAddress = result.data.postalAddressById;
      expect(postalAddress).to.have.all.keys(
        'uuid',
        'name',
        'streetAddress',
        'postalCode',
        'addressLocality',
        'latitude',
        'longitude',
        'buildings'
      );
      expect(postalAddress).to.be.an('object');
      expect(postalAddress.uuid).to.be.uuid('v4');
      expect(postalAddress.name).to.be.a('string');
      expect(postalAddress.streetAddress).to.be.a('string');
      expect(postalAddress.postalCode).to.be.a('string');
      expect(postalAddress.addressLocality).to.be.a('string');
      expect(postalAddress.latitude).to.be.a('string');
      expect(postalAddress.longitude).to.be.a('string');
      expect(postalAddress.buildings).to.be.a('array');
    });
  });
});
