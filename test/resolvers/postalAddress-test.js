'use strict';
/* eslint-disable no-unused-expressions */
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

const context = { models, request };

const buildings = Array(20).fill('').map(level => {
  return {
    uuid: faker.random.uuid(),
    name: faker.random.word(),
    type: faker.random.word(),
    latitude: faker.address.latitude(),
    longitude: faker.address.longitude()
  };
});

const postalAddress = {
  uuid: faker.random.uuid(),
  name: faker.random.words(3),
  streetAddress: faker.address.streetAddress(),
  postalCode: faker.address.zipCode(),
  addressLocality: faker.address.city(),
  latitude: faker.address.latitude(),
  longitude: faker.address.longitude(),
  buildings
};

describe('src/resolvers/postalAddress.js', function () {
  before(function () {
    this.timeout(100000);
    return models.sequelize.sync().then(() => {
      return models.postalAddress.create(postalAddress, {
        include: [models.building]
      });
    });
  });

  describe('Query', function () {
    it('postalAddresses() should return all postalAddresses', function () {
      expect(resolvers.Query.postalAddresses).to.be.an('function');
      return resolvers.Query.postalAddresses(null, null, context).then((postalAddresses) => {
        expect(postalAddresses).to.be.an('array');
        postalAddresses.map(postalAddress => {
          expect(postalAddress).to.be.an('object');
          expect(postalAddress).to.have.property('name');
          expect(postalAddress).to.have.property('streetAddress');
          expect(postalAddress).to.have.property('postalCode');
          expect(postalAddress).to.have.property('addressLocality');
          expect(postalAddress).to.have.property('latitude');
          expect(postalAddress).to.have.property('longitude');
        });
      });
    });

    it('postalAddress() should return an postalAddress', function () {
      expect(resolvers.Query.postalAddressById).to.be.an('function');
      return resolvers.Query.postalAddressById(null, { uuid: postalAddress.uuid }, context).then((postalAddress) => {
        expect(postalAddress).to.be.an('object');
        expect(postalAddress).to.have.property('name');
        expect(postalAddress).to.have.property('streetAddress');
        expect(postalAddress).to.have.property('postalCode');
        expect(postalAddress).to.have.property('addressLocality');
        expect(postalAddress).to.have.property('latitude');
        expect(postalAddress).to.have.property('longitude');
      });
    });
  });

  describe('PostalAddress', function () {
    it('buildings() should return all buildings', function () {
      expect(resolvers.PostalAddress.buildings).to.be.an('function');
      return resolvers.Query.postalAddressById(null, { uuid: postalAddress.uuid }, context).then(postalAddress => {
        return resolvers.PostalAddress.buildings(postalAddress, null, context);
      }).then(levels => {
        expect(levels).to.be.an('array');
        expect(levels.length).to.equal(20);
      });
    });
  });

  describe('Mutation', function () {
    it('postalAddressCreate() should create a postalAddress', function () {
      expect(resolvers.Mutation.postalAddressCreate).to.be.an('function');
      return resolvers.Mutation.postalAddressCreate(null, {
        input: {
          name: faker.random.words(3),
          streetAddress: faker.address.streetAddress(),
          postalCode: faker.address.zipCode(),
          addressLocality: faker.address.city(),
          latitude: faker.address.latitude(),
          longitude: faker.address.longitude()
        }
      }, context).then((postalAddress) => {
        expect(postalAddress).to.be.an('object');
        expect(postalAddress).to.have.property('name');
        expect(postalAddress).to.have.property('streetAddress');
        expect(postalAddress).to.have.property('postalCode');
        expect(postalAddress).to.have.property('addressLocality');
        expect(postalAddress).to.have.property('latitude');
        expect(postalAddress).to.have.property('longitude');
      });
    });

    it('postalAddressCreate() should create a postalAddress with building', function () {
      expect(resolvers.Mutation.postalAddressCreate).to.be.an('function');
      return resolvers.Mutation.postalAddressCreate(null, {
        input: {
          name: faker.random.words(3),
          streetAddress: faker.address.streetAddress(),
          postalCode: faker.address.zipCode(),
          addressLocality: faker.address.city(),
          latitude: faker.address.latitude(),
          longitude: faker.address.longitude(),
          buildingUuids: postalAddress.buildings.map(building => building.uuid)
        }
      }, context).then((postalAddress) => {
        expect(postalAddress).to.be.an('object');
        expect(postalAddress).to.have.property('name');
        expect(postalAddress).to.have.property('streetAddress');
        expect(postalAddress).to.have.property('postalCode');
        expect(postalAddress).to.have.property('addressLocality');
        expect(postalAddress).to.have.property('latitude');
        expect(postalAddress).to.have.property('longitude');
        expect(postalAddress.buildings).to.be.an('array');
        expect(postalAddress.buildings.length).to.equal(20);
      });
    });

    it('postalAddressUpdate() should update an postalAddress', function () {
      expect(resolvers.Mutation.postalAddressUpdate).to.be.an('function');
      return resolvers.Mutation.postalAddressUpdate(null, {
        uuid: postalAddress.uuid,
        input: {
          name: 'DEFI Informatique'
        }
      }, context).then((postalAddress) => {
        expect(postalAddress).to.be.an('object');
        expect(postalAddress).to.have.property('name');
        expect(postalAddress.name).to.equal('DEFI Informatique');
        expect(postalAddress).to.have.property('streetAddress');
        expect(postalAddress).to.have.property('postalCode');
        expect(postalAddress).to.have.property('addressLocality');
        expect(postalAddress).to.have.property('latitude');
        expect(postalAddress).to.have.property('longitude');
      });
    });

    it('postalAddressUpdate() should update a postalAddress with level', function () {
      expect(resolvers.Mutation.postalAddressUpdate).to.be.an('function');
      return resolvers.Mutation.postalAddressUpdate(null, {
        uuid: postalAddress.uuid,
        input: {
          name: faker.random.word(),
          type: faker.random.word(),
          latitude: faker.address.latitude(),
          longitude: faker.address.longitude(),
          buildingUuids: postalAddress.buildings.map(building => building.uuid).slice(0, 10)
        }
      }, context).then((postalAddress) => {
        expect(postalAddress).to.be.an('object');
        expect(postalAddress).to.have.property('name');
        expect(postalAddress).to.have.property('streetAddress');
        expect(postalAddress).to.have.property('postalCode');
        expect(postalAddress).to.have.property('addressLocality');
        expect(postalAddress).to.have.property('latitude');
        expect(postalAddress).to.have.property('longitude');
        expect(postalAddress.buildings).to.be.an('array');
        expect(postalAddress.buildings.length).to.equal(10);
      });
    });

    it('postalAddressUpdate() should throw an error with wrong uuid', async function () {
      expect(resolvers.Mutation.postalAddressUpdate).to.be.an('function');
      const error = await resolvers.Mutation.postalAddressUpdate(null, {
        uuid: 123456789,
        input: {
          name: 'DEFI Informatique'
        }
      }, context);
      expect(error).to.be.an.instanceof(Error);
      expect(error.message).to.equal('unknown uuid');
    });

    it('postalAddressDelete() should delete a postalAddress', function () {
      expect(resolvers.Mutation.postalAddressDelete).to.be.an('function');
      return resolvers.Mutation.postalAddressDelete(null, {
        uuid: postalAddress.uuid
      }, context);
    });

    it('postalAddressDelete() should throw an error with wrong uuid', async function () {
      expect(resolvers.Mutation.postalAddressDelete).to.be.an('function');
      const error = await resolvers.Mutation.postalAddressDelete(null, {
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
