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

const offers = Array(5).fill('').map(() => {
  return {
    uuid: faker.random.uuid(),
    aviabilyStarts: faker.date.past(10),
    aviabilyEnds: faker.date.future(2),
    price: faker.commerce.price(),
    category: faker.lorem.word()
  };
});

const service = {
  uuid: faker.random.uuid(),
  name: faker.lorem.word(),
  description: faker.lorem.words(5),
  offers
};

describe('src/resolvers/service.js', function () {
  before(function () {
    this.timeout(100000);
    return models.sequelize.sync().then(() => {
      return models.service.create(service, {
        include: [models.offer]
      });
    });
  });

  describe('Query', function () {
    it('services() should return all services', function () {
      expect(resolvers.Query.services).to.be.an('function');
      return resolvers.Query.services(null, null, context).then((services) => {
        expect(services).to.be.an('array');
        services.map(service => {
          expect(service).to.be.an('object');
          expect(service).to.have.property('name');
          expect(service).to.have.property('description');
        });
      });
    });

    it('serviceByID() should return an service', function () {
      expect(resolvers.Query.serviceById).to.be.an('function');
      return resolvers.Query.serviceById(null, { uuid: service.uuid }, context).then((service) => {
        expect(service).to.be.an('object');
        expect(service).to.have.property('name');
        expect(service).to.have.property('description');
      });
    });
  });

  describe('Service', function () {
    it('offers() should return all offers', function () {
      expect(resolvers.Service.offers).to.be.an('function');
      return resolvers.Query.serviceById(null, { uuid: service.uuid }, context).then(service => {
        return resolvers.Service.offers(service, null, context);
      }).then(offers => {
        expect(offers).to.be.an('array');
        expect(offers.length).to.equal(5);
      });
    });
  });

  describe('Mutation', function () {
    it('serviceCreate() should create a service', function () {
      expect(resolvers.Mutation.serviceCreate).to.be.an('function');
      return resolvers.Mutation.serviceCreate(null, {
        input: {
          name: faker.lorem.word(),
          description: faker.lorem.words(5)
        }
      }, context).then((service) => {
        expect(service).to.be.an('object');
        expect(service).to.have.property('name');
        expect(service).to.have.property('description');
      });
    });

    it('serviceCreate() should create a service with offers', function () {
      expect(resolvers.Mutation.serviceCreate).to.be.an('function');
      return resolvers.Mutation.serviceCreate(null, {
        input: {
          name: faker.lorem.word(),
          description: faker.lorem.words(5),
          offerUuids: offers.map(offer => offer.uuid)
        }
      }, context).then((service) => {
        expect(service).to.be.an('object');
        expect(service).to.have.property('name');
        expect(service).to.have.property('description');
        expect(service).to.have.property('offers');
        expect(service.offers).to.be.an('array');
        expect(service.offers.length).to.equal(5);
      });
    });

    it('serviceUpdate() should update an service', function () {
      expect(resolvers.Mutation.serviceUpdate).to.be.an('function');
      return resolvers.Mutation.serviceUpdate(null, {
        uuid: service.uuid,
        input: {
          name: 'Dératisation'
        }
      }, context).then((service) => {
        expect(service).to.be.an('object');
        expect(service).to.have.property('name');
        expect(service).to.have.property('description');
        expect(service.name).to.equal('Dératisation');
      });
    });

    it('serviceUpdate() should update an service with offers', function () {
      expect(resolvers.Mutation.serviceUpdate).to.be.an('function');
      return resolvers.Mutation.serviceUpdate(null, {
        uuid: service.uuid,
        input: {
          name: 'Dératisation',
          offerUuids: offers.map(offer => offer.uuid).slice(0, 3)
        }
      }, context).then((service) => {
        expect(service).to.be.an('object');
        expect(service).to.have.property('name');
        expect(service).to.have.property('description');
        expect(service.name).to.equal('Dératisation');
        expect(service).to.have.property('offers');
        expect(service.offers).to.be.an('array');
        expect(service.offers.length).to.equal(3);
      });
    });

    it('serviceUpdate() should throw an error with wrong uuid', async function () {
      expect(resolvers.Mutation.serviceUpdate).to.be.an('function');
      const error = await resolvers.Mutation.serviceUpdate(null, {
        uuid: 123456789,
        input: {
          name: 'Dératisation'
        }
      }, context);
      expect(error).to.be.an.instanceof(Error);
      expect(error.message).to.equal('unknown uuid');
    });

    it('serviceDelete() should delete a service', function () {
      expect(resolvers.Mutation.serviceDelete).to.be.an('function');
      return resolvers.Mutation.serviceDelete(null, {
        uuid: service.uuid
      }, context);
    });

    it('serviceDelete() should throw an error with wrong uuid', async function () {
      expect(resolvers.Mutation.serviceDelete).to.be.an('function');
      const error = await resolvers.Mutation.serviceDelete(null, {
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
