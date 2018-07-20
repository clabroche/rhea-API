const { makeExecutableSchema, mockServer } = require('graphql-tools');
const chai = require('chai');
chai.use(require('chai-uuid'));
const expect = chai.expect;

const userTypeDefs = require('./../../src/schemas/organization.js');
const schema = makeExecutableSchema({
  typeDefs: [userTypeDefs],
  resolverValidationOptions: {
    requireResolversForResolveType: false
  }
});
const myMockServer = mockServer(schema);

describe('src/schemas/organization.js', function () {
  it('should return all organizations', function () {
    return myMockServer.query(`{
      organizations {
        uuid
        name
        telephone
        email
        type
        logo
        postalAddresses {
          uuid
          name
        }
        memberOf {
          uuid
          name
        }
        customers {
          ... on Person {
            uuid
            givenName
          }
          ... on Organization {
            uuid
            name
          }
        }
      }
    }`).then((result) => {
      expect(result).to.be.an('object');
      expect(result).to.have.property('data');
      expect(result).to.have.nested.property('data.organizations');
      expect(result.data.organizations).to.be.an('array');
      result.data.organizations.map(organization => {
        expect(organization).to.have.all.keys(
          'uuid',
          'name',
          'telephone',
          'email',
          'type',
          'logo',
          'postalAddresses',
          'memberOf',
          'customers'
        );
        expect(organization).to.be.an('object');
        expect(organization.uuid).to.be.uuid('v4');
        expect(organization.name).to.be.a('string');
        expect(organization.telephone).to.be.a('string');
        expect(organization.email).to.be.a('string');
        expect(organization.type).to.be.a('string');
        expect(organization.logo).to.be.a('string');
        expect(organization.postalAddresses).to.be.an('array');
        expect(organization.memberOf).to.be.an('object');
        expect(organization.customers).to.be.an('array');
      });
    });
  });

  it('should return an organization', function () {
    return myMockServer.query(`{
      organizationById(uuid:"3ff8e598-c921-4201-a58a-7ce087ca1253") {
        uuid
        name
        telephone
        email
        type
        logo
        postalAddresses {
          uuid
          name
        }
        memberOf {
          uuid
          name
        }
        customers {
          ... on Person {
            uuid
            givenName
          }
        }
      }
    }`).then((result) => {
      expect(result).to.be.an('object');
      expect(result).to.have.property('data');
      expect(result).to.have.nested.property('data.organizationById');
      expect(result.data.organizationById).to.be.an('object');
      const organization = result.data.organizationById;
      expect(organization).to.have.all.keys(
        'uuid',
        'name',
        'telephone',
        'email',
        'type',
        'logo',
        'postalAddresses',
        'memberOf',
        'customers'
      );
      expect(organization).to.be.an('object');
      expect(organization.uuid).to.be.uuid('v4');
      expect(organization.name).to.be.a('string');
      expect(organization.telephone).to.be.a('string');
      expect(organization.email).to.be.a('string');
      expect(organization.type).to.be.a('string');
      expect(organization.logo).to.be.a('string');
      expect(organization.postalAddresses).to.be.an('array');
      expect(organization.memberOf).to.be.an('object');
      expect(organization.customers).to.be.an('array');
    });
  });
});
