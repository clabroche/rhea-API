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

const [organization, anotherOrganization] = Array(2).fill('').map(() => {
  return {
    uuid: faker.random.uuid(),
    name: faker.company.companyName(),
    logo: faker.system.filePath(),
    entity: {
      telephone: faker.phone.phoneNumber(),
      email: faker.internet.email(),
      type: 'vendor'
    }
  };
});

const services = Array(5).fill('').map(() => {
  return {
    uuid: faker.random.uuid(),
    name: faker.lorem.word(),
    description: faker.lorem.words(5)
  };
});

const offer = {
  uuid: faker.random.uuid(),
  aviabilyStarts: faker.date.past(10),
  aviabilyEnds: faker.date.future(2),
  price: faker.commerce.price(),
  category: faker.lorem.word(),
  organization,
  services
};

describe('src/resolvers/offer.js', function () {
  before(function () {
    this.timeout(100000);
    return models.sequelize.sync().then(() => {
      return models.offer.create(offer, {
        include: [models.service, models.organization]
      }).then(() => models.organization.create(anotherOrganization));
    });
  });

  describe('Query', function () {
    it('offers() should return all offers', function () {
      expect(resolvers.Query.offers).to.be.an('function');
      return resolvers.Query.offers(null, null, context).then((offers) => {
        expect(offers).to.be.an('array');
        offers.map(offer => {
          expect(offer).to.be.an('object');
          expect(offer).to.have.property('aviabilyStarts');
          expect(offer).to.have.property('aviabilyEnds');
          expect(offer).to.have.property('price');
          expect(offer).to.have.property('category');
        });
      });
    });

    it('offerByID() should return an offer', function () {
      expect(resolvers.Query.offerById).to.be.an('function');
      return resolvers.Query.offerById(null, { uuid: offer.uuid }, context).then((offer) => {
        expect(offer).to.be.an('object');
        expect(offer).to.have.property('aviabilyStarts');
        expect(offer).to.have.property('aviabilyEnds');
        expect(offer).to.have.property('price');
        expect(offer).to.have.property('category');
      });
    });
  });

  describe('Offer', function () {
    it('services() should return all services', function () {
      expect(resolvers.Offer.services).to.be.an('function');
      return resolvers.Query.offerById(null, { uuid: offer.uuid }, context).then(offer => {
        return resolvers.Offer.services(offer, null, context);
      }).then(services => {
        expect(services).to.be.an('array');
        expect(services.length).to.equal(5);
      });
    });

    it('offeredBy() shoulf return an organization', function () {
      expect(resolvers.Offer.offeredBy).to.be.an('function');
      return resolvers.Query.offerById(null, { uuid: offer.uuid }, context).then(offer => {
        return resolvers.Offer.offeredBy(offer, null, context);
      }).then(organization => {
        expect(organization).to.be.an('object');
      });
    });
  });

  describe('Mutation', function () {
    it('offerCreate() should create a offer', function () {
      expect(resolvers.Mutation.offerCreate).to.be.an('function');
      return resolvers.Mutation.offerCreate(null, {
        input: {
          aviabilyStarts: faker.date.past(5),
          aviabilyEnds: faker.date.future(3),
          price: faker.commerce.price(),
          category: faker.lorem.word()
        }
      }, context).then((offer) => {
        expect(offer).to.be.an('object');
        expect(offer).to.have.property('aviabilyStarts');
        expect(offer).to.have.property('aviabilyEnds');
        expect(offer).to.have.property('price');
        expect(offer).to.have.property('category');
      });
    });

    it('offerCreate() should create a offer with services', function () {
      expect(resolvers.Mutation.offerCreate).to.be.an('function');
      return resolvers.Mutation.offerCreate(null, {
        input: {
          aviabilyStarts: faker.date.past(5),
          aviabilyEnds: faker.date.future(3),
          price: faker.commerce.price(),
          category: faker.lorem.word(),
          serviceUuids: services.map(service => service.uuid)
        }
      }, context).then((offer) => {
        expect(offer).to.be.an('object');
        expect(offer).to.have.property('aviabilyStarts');
        expect(offer).to.have.property('aviabilyEnds');
        expect(offer).to.have.property('price');
        expect(offer).to.have.property('category');
        expect(offer).to.have.property('services');
        expect(offer.services).to.be.an('array');
        expect(offer.services.length).to.equal(5);
      });
    });

    it('offerCreate() should create a offer with organization', function () {
      expect(resolvers.Mutation.offerCreate).to.be.an('function');
      return resolvers.Mutation.offerCreate(null, {
        input: {
          aviabilyStarts: faker.date.past(5),
          aviabilyEnds: faker.date.future(3),
          price: faker.commerce.price(),
          category: faker.lorem.word(),
          offeredByUuid: organization.uuid
        }
      }, context).then((offer) => {
        expect(offer).to.be.an('object');
        expect(offer).to.have.property('aviabilyStarts');
        expect(offer).to.have.property('aviabilyEnds');
        expect(offer).to.have.property('price');
        expect(offer).to.have.property('category');
        expect(offer).to.have.property('organization');
        expect(offer.organization).to.be.an('object');
      });
    });

    it('offerUpdate() should update an offer', function () {
      expect(resolvers.Mutation.offerUpdate).to.be.an('function');
      return resolvers.Mutation.offerUpdate(null, {
        uuid: offer.uuid,
        input: {
          aviabilyEnds: '1991-12-24',
          price: 321.45
        }
      }, context).then((offer) => {
        expect(offer).to.be.an('object');
        expect(offer).to.have.property('aviabilyStarts');
        expect(offer).to.have.property('aviabilyEnds');
        expect(offer).to.have.property('price');
        expect(offer).to.have.property('category');
        expect(offer.price).to.equal(321.45);
      });
    });

    it('offerUpdate() should update an offer with services', function () {
      expect(resolvers.Mutation.offerUpdate).to.be.an('function');
      return resolvers.Mutation.offerUpdate(null, {
        uuid: offer.uuid,
        input: {
          aviabilyEnds: '1991-12-24',
          price: 321.45,
          serviceUuids: services.map(service => service.uuid).slice(0, 3)
        }
      }, context).then((offer) => {
        expect(offer).to.be.an('object');
        expect(offer).to.have.property('aviabilyStarts');
        expect(offer).to.have.property('aviabilyEnds');
        expect(offer).to.have.property('price');
        expect(offer).to.have.property('category');
        expect(offer.price).to.equal(321.45);
        expect(offer).to.have.property('services');
        expect(offer.services).to.be.an('array');
        expect(offer.services.length).to.equal(3);
      });
    });

    it('offerUpdate() should update an offer with organization', function () {
      expect(resolvers.Mutation.offerUpdate).to.be.an('function');
      return resolvers.Mutation.offerUpdate(null, {
        uuid: offer.uuid,
        input: {
          aviabilyEnds: '1991-12-24',
          price: 321.45,
          offeredByUuid: anotherOrganization.uuid
        }
      }, context).then((offer) => {
        expect(offer).to.be.an('object');
        expect(offer).to.have.property('aviabilyStarts');
        expect(offer).to.have.property('aviabilyEnds');
        expect(offer).to.have.property('price');
        expect(offer).to.have.property('category');
        expect(offer.price).to.equal(321.45);
        expect(offer).to.have.property('organization');
        expect(offer.organization).to.be.an('object');
      });
    });

    it('offerUpdate() should throw an error with wrong uuid', async function () {
      expect(resolvers.Mutation.offerUpdate).to.be.an('function');
      const error = await resolvers.Mutation.offerUpdate(null, {
        uuid: 123456789,
        input: {
          price: 321.45
        }
      }, context);
      expect(error).to.be.an.instanceof(Error);
      expect(error.message).to.equal('unknown uuid');
    });

    it('offerDelete() should delete a offer', function () {
      expect(resolvers.Mutation.offerDelete).to.be.an('function');
      return resolvers.Mutation.offerDelete(null, {
        uuid: offer.uuid
      }, context);
    });

    it('offerDelete() should throw an error with wrong uuid', async function () {
      expect(resolvers.Mutation.offerDelete).to.be.an('function');
      const error = await resolvers.Mutation.offerDelete(null, {
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
