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

describe('src/resolvers/customer.js', function () {
  before(function () {
    this.timeout(100000);
    return models.sequelize.sync().then(function () {
      return Promise.all([
        models.organization.create(inputOrgCustomer, {
          include: [models.entity]
        }),
        models.person.create(inputPersCustomer, {
          include: [models.entity]
        })
      ]);
    });
  });

  describe('Customers', function () {
    it('Customers.__resolveType() should resolve the type from a organization object', function () {
      expect(resolvers.Customer.__resolveType).to.be.an('function');
      return models.organization.findById(inputOrgCustomer.uuid, {
        include: [models.entity]
      }).then(obj => {
        return resolvers.Customer.__resolveType(obj);
      }).then(type => {
        expect(type).to.equal('Organization');
      });
    });

    it('Customers.__resolveType() should resolve the type from a person object', function () {
      expect(resolvers.Customer.__resolveType).to.be.an('function');
      return models.person.findById(inputPersCustomer.uuid, {
        include: [models.entity]
      }).then(obj => {
        return resolvers.Customer.__resolveType(obj);
      }).then(type => {
        expect(type).to.equal('Person');
      });
    });
  });

  after(function () {
    this.timeout(100000);
    sandbox.restore();
    return models.sequelize.drop();
  });
});
