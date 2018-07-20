'use strict';
/* eslint-disable no-unused-expressions */
const Promise = require('bluebird');
const expect = require('chai').expect;
const faker = require('faker');
const sinon = require('sinon');
const sandbox = sinon.createSandbox();
const resolvers = require('../../src/resolvers');
const models = require('./../../src/models');
const request = {
  user: models.account.build({
    uuid: faker.random.uuid()
  })
};
sandbox.stub(request.user, 'hasPermissionTo').returns(Promise.resolve(true));

const context = { request };

const postalAddresses = Array(5).fill('').map(() => {
  return {
    uuid: faker.random.uuid(),
    name: faker.random.words(3),
    streetAddress: faker.address.streetAddress(),
    postalCode: faker.address.zipCode(),
    addressLocality: faker.address.city(),
    latitude: faker.address.latitude(),
    longitude: faker.address.longitude()
  };
});

const inputOrgVendor = {
  uuid: faker.random.uuid(),
  name: faker.company.companyName(),
  logo: faker.system.filePath(),
  entity: {
    uuid: faker.random.uuid(),
    telephone: faker.phone.phoneNumber(),
    email: faker.internet.email(),
    type: 'vendor',
    postalAddresses
  }
};

const inputOrgCustomer = {
  uuid: faker.random.uuid(),
  name: faker.company.companyName(),
  logo: faker.system.filePath(),
  entity: {
    uuid: faker.random.uuid(),
    telephone: faker.phone.phoneNumber(),
    email: faker.internet.email(),
    type: 'customer'
  }
};

const inputPersCustomer = {
  uuid: faker.random.uuid(),
  givenName: faker.name.firstName(),
  familyName: faker.name.lastName(),
  entity: {
    uuid: faker.random.uuid(),
    telephone: faker.phone.phoneNumber(),
    email: faker.internet.email(),
    type: 'customer'
  }
};

describe('src/resolvers/organization.js', function () {
  before(function () {
    this.timeout(100000);
    return models.sequelize.sync().then(function () {
      return Promise.join(
        models.organization.create(inputOrgVendor, {
          include: [{
            model: models.entity,
            include: [models.postalAddress]
          }]
        }),
        models.organization.create(inputOrgCustomer, {
          include: [models.entity]
        }),
        models.person.create(inputPersCustomer, {
          include: [models.entity]
        }),
        function (vendor, OrgCustomer, PersCustomer) {
          return [OrgCustomer, PersCustomer].map(customer => vendor.entity.addCustomer(customer.entity));
        }
      );
    });
  });

  describe('Query', function () {
    it('organizations() should return all organizations', function () {
      expect(resolvers.Query.organizations).to.be.an('function');
      return resolvers.Query.organizations(null, null, context).then((organizations) => {
        expect(organizations).to.be.an('array');
        organizations.map(organization => {
          expect(organization).to.be.an('object');
          expect(organization).to.have.property('uuid');
          expect(organization).to.have.property('name');
          expect(organization).to.have.property('logo');
          expect(organization).to.have.property('entity');
          expect(organization.entity).to.be.an('object');
          expect(organization.entity).to.have.property('uuid');
          expect(organization.entity).to.have.property('telephone');
          expect(organization.entity).to.have.property('email');
          expect(organization.entity).to.have.property('type');
        });
      });
    });

    it('organizations() should return all vendor-type organizations', function () {
      expect(resolvers.Query.organizations).to.be.an('function');
      return resolvers.Query.organizations(null, { type: 'vendor' }, context).then((organizations) => {
        expect(organizations).to.be.an('array');
        organizations.map(organization => {
          expect(organization).to.be.an('object');
          expect(organization).to.have.property('uuid');
          expect(organization).to.have.property('name');
          expect(organization).to.have.property('logo');
          expect(organization).to.have.property('entity');
          expect(organization.entity).to.be.an('object');
          expect(organization.entity).to.have.property('uuid');
          expect(organization.entity).to.have.property('telephone');
          expect(organization.entity).to.have.property('email');
          expect(organization.entity).to.have.property('type');
          expect(organization.entity.type).to.equal('vendor');
        });
      });
    });

    it('organization() should return an organization', function () {
      expect(resolvers.Query.organizationById).to.be.an('function');
      return resolvers.Query.organizationById(
        null,
        { uuid: inputOrgVendor.uuid },
        context
      ).then((organization) => {
        expect(organization).to.be.an('object');
        expect(organization).to.have.property('uuid');
        expect(organization).to.have.property('name');
        expect(organization).to.have.property('logo');
        expect(organization).to.have.property('entity');
        expect(organization.entity).to.be.an('object');
        expect(organization.entity).to.have.property('uuid');
        expect(organization.entity).to.have.property('telephone');
        expect(organization.entity).to.have.property('email');
        expect(organization.entity).to.have.property('type');
      });
    });
  });

  describe('Organization', function () {
    it('postalAddresses() should return all postalAddresses', function () {
      expect(resolvers.Organization.postalAddresses).to.be.an('function');
      return resolvers.Query.organizationById(null, { uuid: inputOrgVendor.uuid }, context).then(organization => {
        return resolvers.Organization.postalAddresses(organization, null, context);
      }).then(postalAddresses => {
        expect(postalAddresses).to.be.an('array');
        expect(postalAddresses.length).to.equal(5);
      });
    });

    it('customers() should return all customers', function () {
      expect(resolvers.Organization.customers).to.be.an('function');
      return resolvers.Query.organizationById(null, { uuid: inputOrgVendor.uuid }, context).then(organization => {
        return resolvers.Organization.customers(organization, null, context);
      }).then(customers => {
        expect(customers).to.be.an('array');
        expect(customers.length).to.equal(2);
      });
    });
  });

  describe('Mutation', function () {
    it('organizationCreate() should create an organization', function () {
      expect(resolvers.Mutation.organizationCreate).to.be.an('function');
      return resolvers.Mutation.organizationCreate(null, {
        input: {
          name: faker.company.companyName(),
          telephone: faker.phone.phoneNumber(),
          email: faker.internet.email(),
          type: 'vendor',
          logo: faker.system.filePath()
        }
      }, context).then((organization) => {
        expect(organization).to.be.an('object');
        expect(organization).to.have.property('uuid');
        expect(organization).to.have.property('name');
        expect(organization).to.have.property('logo');
        expect(organization).to.have.property('entity');
        expect(organization.entity).to.be.an('object');
        expect(organization.entity).to.have.property('uuid');
        expect(organization.entity).to.have.property('telephone');
        expect(organization.entity).to.have.property('email');
        expect(organization.entity).to.have.property('type');
      });
    });

    it('organizationCreate() should create an organization with postalAdresses', function () {
      expect(resolvers.Mutation.organizationCreate).to.be.an('function');
      return resolvers.Mutation.organizationCreate(null, {
        input: {
          name: faker.company.companyName(),
          telephone: faker.phone.phoneNumber(),
          email: faker.internet.email(),
          type: 'vendor',
          logo: faker.system.filePath(),
          postalAddresseUuids: postalAddresses.map(postalAddress => postalAddress.uuid)
        }
      }, context).then((organization) => {
        expect(organization).to.be.an('object');
        expect(organization).to.have.property('uuid');
        expect(organization).to.have.property('name');
        expect(organization).to.have.property('logo');
        expect(organization).to.have.property('entity');
        expect(organization.entity).to.be.an('object');
        expect(organization.entity).to.have.property('uuid');
        expect(organization.entity).to.have.property('telephone');
        expect(organization.entity).to.have.property('email');
        expect(organization.entity).to.have.property('type');
        expect(organization.entity).to.have.property('postalAddresses');
        expect(organization.entity.postalAddresses).to.be.an('array');
        expect(organization.entity.postalAddresses.length).to.equal(5);
      });
    });

    it('organizationCreate() should create an organization with customers', function () {
      expect(resolvers.Mutation.organizationCreate).to.be.an('function');
      return resolvers.Mutation.organizationCreate(null, {
        input: {
          name: faker.company.companyName(),
          telephone: faker.phone.phoneNumber(),
          email: faker.internet.email(),
          type: 'vendor',
          logo: faker.system.filePath(),
          customerUuids: [inputOrgCustomer.uuid, inputPersCustomer.uuid]
        }
      }, context).then((organization) => {
        expect(organization).to.be.an('object');
        expect(organization).to.have.property('uuid');
        expect(organization).to.have.property('name');
        expect(organization).to.have.property('logo');
        expect(organization).to.have.property('entity');
        expect(organization.entity).to.be.an('object');
        expect(organization.entity).to.have.property('uuid');
        expect(organization.entity).to.have.property('telephone');
        expect(organization.entity).to.have.property('email');
        expect(organization.entity).to.have.property('type');
        expect(organization.entity).to.have.property('customers');
        expect(organization.entity.customers).to.be.an('array');
        expect(organization.entity.customers.length).to.equal(2);
      });
    });

    it('organizationUpdate() should update an organization', function () {
      expect(resolvers.Mutation.organizationUpdate).to.be.an('function');
      return resolvers.Mutation.organizationUpdate(null, {
        uuid: inputOrgVendor.uuid,
        input: {
          uuid: faker.random.uuid(),
          name: faker.company.companyName(),
          telephone: faker.phone.phoneNumber(),
          email: faker.internet.email(),
          type: 'vendor',
          logo: faker.system.filePath()
        }
      }, context).then((organization) => {
        expect(organization).to.be.an('object');
        expect(organization).to.have.property('uuid');
        expect(organization).to.have.property('name');
        expect(organization).to.have.property('logo');
        expect(organization).to.have.property('entity');
        expect(organization.entity).to.be.an('object');
        expect(organization.entity).to.have.property('uuid');
        expect(organization.entity).to.have.property('telephone');
        expect(organization.entity).to.have.property('email');
        expect(organization.entity).to.have.property('type');
      });
    });

    it('organizationUpdate() should update an organization with postalAddress', function () {
      expect(resolvers.Mutation.organizationUpdate).to.be.an('function');
      return resolvers.Mutation.organizationUpdate(null, {
        uuid: inputOrgVendor.uuid,
        input: {
          uuid: faker.random.uuid(),
          name: faker.company.companyName(),
          telephone: faker.phone.phoneNumber(),
          email: faker.internet.email(),
          type: 'vendor',
          logo: faker.system.filePath(),
          postalAddresseUuids: postalAddresses.map(postalAddress => postalAddress.uuid).slice(0, 3)
        }
      }, context).then((organization) => {
        expect(organization).to.be.an('object');
        expect(organization).to.have.property('uuid');
        expect(organization).to.have.property('name');
        expect(organization).to.have.property('logo');
        expect(organization).to.have.property('entity');
        expect(organization.entity).to.be.an('object');
        expect(organization.entity).to.have.property('uuid');
        expect(organization.entity).to.have.property('telephone');
        expect(organization.entity).to.have.property('email');
        expect(organization.entity).to.have.property('type');
        expect(organization.entity).to.have.property('postalAddresses');
        expect(organization.entity.postalAddresses).to.be.an('array');
        expect(organization.entity.postalAddresses.length).to.equal(3);
      });
    });

    it('organizationUpdate() should update an organization with customers', function () {
      expect(resolvers.Mutation.organizationUpdate).to.be.an('function');
      return resolvers.Mutation.organizationUpdate(null, {
        uuid: inputOrgVendor.uuid,
        input: {
          uuid: faker.random.uuid(),
          name: faker.company.companyName(),
          telephone: faker.phone.phoneNumber(),
          email: faker.internet.email(),
          type: 'vendor',
          logo: faker.system.filePath(),
          customerUuids: [inputOrgCustomer.uuid]
        }
      }, context).then((organization) => {
        expect(organization).to.be.an('object');
        expect(organization).to.have.property('uuid');
        expect(organization).to.have.property('name');
        expect(organization).to.have.property('logo');
        expect(organization).to.have.property('entity');
        expect(organization.entity).to.be.an('object');
        expect(organization.entity).to.have.property('uuid');
        expect(organization.entity).to.have.property('telephone');
        expect(organization.entity).to.have.property('email');
        expect(organization.entity).to.have.property('type');
        expect(organization.entity).to.have.property('customers');
        expect(organization.entity.customers).to.be.an('array');
        expect(organization.entity.customers.length).to.equal(1);
      });
    });

    it('organizationUpdate() should throw an error with wrong uuid', async function () {
      expect(resolvers.Mutation.organizationUpdate).to.be.an('function');
      const error = await resolvers.Mutation.organizationUpdate(null, {
        uuid: 123456789,
        input: {
          uuid: faker.random.uuid(),
          name: faker.company.companyName(),
          telephone: faker.phone.phoneNumber(),
          email: faker.internet.email(),
          type: 'vendor',
          logo: faker.system.filePath(),
          postalAddresseUuids: inputOrgVendor.entity.postalAddresses.map(postalAddress => postalAddress.uuid).slice(0, 3)
        }
      }, context);
      expect(error).to.be.an.instanceof(Error);
      expect(error.message).to.equal('unknown uuid');
    });

    it('organizationDelete() should delete a organization', function () {
      expect(resolvers.Mutation.organizationDelete).to.be.an('function');
      return resolvers.Mutation.organizationDelete(null, {
        uuid: inputOrgVendor.uuid
      }, context).then(result => {
        expect(result).to.be.true;
      });
    });

    it('organizationDelete() should throw an error with wrong uuid', async function () {
      expect(resolvers.Mutation.organizationDelete).to.be.an('function');
      const error = await resolvers.Mutation.organizationDelete(null, {
        uuid: 123456789
      }, context);
      expect(error).to.be.an.instanceof(Error);
      expect(error.message).to.equal('unknown uuid');
    });
  });

  after(function () {
    this.timeout(100000);
    sandbox.restore();
    return models.sequelize.drop();
  });
});
