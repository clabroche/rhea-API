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

const levels = Array(20).fill('').map(level => {
  return {
    uuid: faker.random.uuid(),
    code: faker.random.alphaNumeric()
  };
});

const building = {
  uuid: faker.random.uuid(),
  name: faker.random.word(),
  type: faker.random.word(),
  latitude: faker.address.latitude(),
  longitude: faker.address.longitude(),
  levels
};

describe('src/resolvers/building.js', function () {
  before(function () {
    this.timeout(100000);
    return models.sequelize.sync().then(() => {
      return models.building.create(building, {
        include: [models.level]
      });
    });
  });

  describe('Query', function () {
    it('buildings() should return all buildings', function () {
      expect(resolvers.Query.buildings).to.be.an('function');
      return resolvers.Query.buildings(null, null, context).then((buildings) => {
        expect(buildings).to.be.an('array');
        buildings.map(building => {
          expect(building).to.be.an('object');
          expect(building).to.have.property('name');
          expect(building).to.have.property('type');
          expect(building).to.have.property('latitude');
          expect(building).to.have.property('longitude');
        });
      });
    });

    it('building() should return an building', function () {
      expect(resolvers.Query.buildingById).to.be.an('function');
      return resolvers.Query.buildingById(null, { uuid: building.uuid }, context).then((building) => {
        expect(building).to.be.an('object');
        expect(building).to.have.property('name');
        expect(building).to.have.property('type');
        expect(building).to.have.property('latitude');
        expect(building).to.have.property('longitude');
      });
    });
  });

  describe('Building', function () {
    it('levels() should return all levels', function () {
      expect(resolvers.Building.levels).to.be.an('function');
      return resolvers.Query.buildingById(null, { uuid: building.uuid }, context).then(building => {
        return resolvers.Building.levels(building, null, context);
      }).then(levels => {
        expect(levels).to.be.an('array');
        expect(levels.length).to.equal(20);
      });
    });
  });

  describe('Mutation', function () {
    it('buildingCreate() should create a building', function () {
      expect(resolvers.Mutation.buildingCreate).to.be.an('function');
      return resolvers.Mutation.buildingCreate(null, {
        input: {
          name: faker.random.word(),
          type: faker.random.word(),
          latitude: faker.address.latitude(),
          longitude: faker.address.longitude()
        }
      }, context).then((building) => {
        expect(building).to.be.an('object');
        expect(building).to.have.property('name');
        expect(building).to.have.property('type');
        expect(building).to.have.property('latitude');
        expect(building).to.have.property('longitude');
      });
    });

    it('buildingCreate() should create a building with level', function () {
      expect(resolvers.Mutation.buildingCreate).to.be.an('function');
      return resolvers.Mutation.buildingCreate(null, {
        input: {
          name: faker.random.word(),
          type: faker.random.word(),
          latitude: faker.address.latitude(),
          longitude: faker.address.longitude(),
          levelUuids: building.levels.map(level => level.uuid)
        }
      }, context).then((building) => {
        expect(building).to.be.an('object');
        expect(building).to.have.property('name');
        expect(building).to.have.property('type');
        expect(building).to.have.property('latitude');
        expect(building).to.have.property('longitude');
        expect(building.levels).to.be.an('array');
        expect(building.levels.length).to.equal(20);
      });
    });

    it('buildingUpdate() should update an building', function () {
      expect(resolvers.Mutation.buildingUpdate).to.be.an('function');
      return resolvers.Mutation.buildingUpdate(null, {
        uuid: building.uuid,
        input: {
          name: 'Shanghai Tower'
        }
      }, context).then((building) => {
        expect(building).to.be.an('object');
        expect(building).to.have.property('name');
        expect(building.name).to.equal('Shanghai Tower');
        expect(building).to.have.property('type');
        expect(building).to.have.property('latitude');
        expect(building).to.have.property('longitude');
      });
    });

    it('buildingUpdate() should update a building with level', function () {
      expect(resolvers.Mutation.buildingUpdate).to.be.an('function');
      return resolvers.Mutation.buildingUpdate(null, {
        uuid: building.uuid,
        input: {
          name: faker.random.word(),
          type: faker.random.word(),
          latitude: faker.address.latitude(),
          longitude: faker.address.longitude(),
          levelUuids: building.levels.map(level => level.uuid).slice(0, 10)
        }
      }, context).then((building) => {
        expect(building).to.be.an('object');
        expect(building).to.have.property('name');
        expect(building).to.have.property('type');
        expect(building).to.have.property('latitude');
        expect(building).to.have.property('longitude');
        expect(building.levels).to.be.an('array');
        expect(building.levels.length).to.equal(10);
      });
    });

    it('buildingUpdate() should throw an error with wrong uuid', async function () {
      expect(resolvers.Mutation.buildingUpdate).to.be.an('function');
      const error = await resolvers.Mutation.buildingUpdate(null, {
        uuid: 123456789,
        input: {
          name: 'Shanghai Tower'
        }
      }, context);
      expect(error).to.be.an.instanceof(Error);
      expect(error.message).to.equal('unknown uuid');
    });

    it('buildingDelete() should delete a building', function () {
      expect(resolvers.Mutation.buildingDelete).to.be.an('function');
      return resolvers.Mutation.buildingDelete(null, {
        uuid: building.uuid
      }, context);
    });

    it('buildingDelete() should throw an error with wrong uuid', async function () {
      expect(resolvers.Mutation.buildingDelete).to.be.an('function');
      const error = await resolvers.Mutation.buildingDelete(null, {
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
