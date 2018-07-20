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

const context = { models, request };

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

const fakePerson = {
  uuid: faker.random.uuid(),
  givenName: faker.name.firstName(),
  familyName: faker.name.lastName(),
  gender: (Math.floor(Math.random() * 10) % 2) ? 'F' : 'M',
  entity: {
    uuid: faker.random.uuid(),
    telephone: faker.phone.phoneNumber(),
    email: faker.internet.email(),
    type: 'vendor',
    postalAddresses
  }
};

const fakeOrganization = {
  uuid: faker.random.uuid(),
  name: faker.company.companyName(),
  logo: faker.system.filePath(),
  entity: {
    uuid: faker.random.uuid(),
    telephone: faker.phone.phoneNumber(),
    email: faker.internet.email(),
    type: 'vendor'
  }
};

describe('src/resolvers/person.js', function () {
  before(function () {
    this.timeout(100000);
    return models.sequelize.sync().then(function () {
      return Promise.join(
        models.person.create(fakePerson, {
          include: [{
            model: models.entity,
            include: [models.postalAddress]
          }]
        }),
        models.organization.create(fakeOrganization, {
          include: [models.entity]
        }),
        (person, organization) => person.addOrganization(organization)
      );
    });
  });

  describe('Query', function () {
    it('people() should return all person', function () {
      expect(resolvers.Query.people).to.be.an('function');
      return resolvers.Query.people(null, null, context).then((people) => {
        expect(people).to.be.an('array');
        people.map(person => {
          expect(person).to.be.an('object');
          expect(person).to.have.property('uuid');
          expect(person).to.have.property('givenName');
          expect(person).to.have.property('familyName');
          expect(person).to.have.property('gender');
          expect(person).to.have.property('entity');
          expect(person.entity).to.be.an('object');
          expect(person.entity).to.have.property('uuid');
          expect(person.entity).to.have.property('telephone');
          expect(person.entity).to.have.property('email');
          expect(person.entity).to.have.property('type');
        });
      });
    });

    it('personById() should return an person', function () {
      expect(resolvers.Query.personById).to.be.an('function');
      return resolvers.Query.personById(
        null,
        { uuid: fakePerson.uuid },
        context
      ).then((person) => {
        expect(person).to.be.an('object');
        expect(person).to.have.property('uuid');
        expect(person).to.have.property('givenName');
        expect(person).to.have.property('familyName');
        expect(person).to.have.property('gender');
        expect(person).to.have.property('entity');
        expect(person.entity).to.be.an('object');
        expect(person.entity).to.have.property('uuid');
        expect(person.entity).to.have.property('telephone');
        expect(person.entity).to.have.property('email');
        expect(person.entity).to.have.property('type');
      });
    });
  });

  describe('Person', function () {
    it('postalAddresses() should return all postalAddresses', function () {
      expect(resolvers.Person.postalAddresses).to.be.an('function');
      return resolvers.Query.personById(null, { uuid: fakePerson.uuid }, context).then(person => {
        return resolvers.Person.postalAddresses(person, null, context);
      }).then(postalAddresses => {
        expect(postalAddresses).to.be.an('array');
        expect(postalAddresses.length).to.equal(5);
      });
    });

    it('worksFor() should return all organizations', function () {
      expect(resolvers.Person.worksFor).to.be.an('function');
      return resolvers.Query.personById(null, { uuid: fakePerson.uuid }, context).then(person => {
        return resolvers.Person.worksFor(person, null, context);
      }).then(organizations => {
        expect(organizations).to.be.an('array');
        expect(organizations.length).to.equal(1);
      });
    });
  });

  describe('Mutation', function () {
    it('personCreate() should create an person', function () {
      expect(resolvers.Mutation.personCreate).to.be.an('function');
      return resolvers.Mutation.personCreate(null, {
        input: {
          givenName: faker.name.firstName(),
          familyName: faker.name.lastName(),
          gender: (Math.floor(Math.random() * 10) % 2) ? 'F' : 'M',
          telephone: faker.phone.phoneNumber(),
          email: faker.internet.email(),
          type: 'vendor'
        }
      }, context).then((person) => {
        expect(person).to.be.an('object');
        expect(person).to.have.property('uuid');
        expect(person).to.have.property('givenName');
        expect(person).to.have.property('familyName');
        expect(person).to.have.property('gender');
        expect(person).to.have.property('entity');
        expect(person.entity).to.be.an('object');
        expect(person.entity).to.have.property('uuid');
        expect(person.entity).to.have.property('telephone');
        expect(person.entity).to.have.property('email');
        expect(person.entity).to.have.property('type');
      });
    });

    it('personCreate() should create an person with postalAdresses', function () {
      expect(resolvers.Mutation.personCreate).to.be.an('function');
      return resolvers.Mutation.personCreate(null, {
        input: {
          givenName: faker.name.firstName(),
          familyName: faker.name.lastName(),
          gender: (Math.floor(Math.random() * 10) % 2) ? 'F' : 'M',
          telephone: faker.phone.phoneNumber(),
          email: faker.internet.email(),
          type: 'vendor',
          postalAddresseUuids: fakePerson.entity.postalAddresses.map(postalAddress => postalAddress.uuid)
        }
      }, context).then((person) => {
        expect(person).to.be.an('object');
        expect(person).to.have.property('uuid');
        expect(person).to.have.property('givenName');
        expect(person).to.have.property('familyName');
        expect(person).to.have.property('gender');
        expect(person).to.have.property('entity');
        expect(person.entity).to.be.an('object');
        expect(person.entity).to.have.property('uuid');
        expect(person.entity).to.have.property('telephone');
        expect(person.entity).to.have.property('email');
        expect(person.entity).to.have.property('type');
        expect(person.entity).to.have.property('postalAddresses');
        expect(person.entity.postalAddresses).to.be.an('array');
        expect(person.entity.postalAddresses.length).to.equal(5);
      });
    });

    it('personUpdate() should update an person', function () {
      expect(resolvers.Mutation.personUpdate).to.be.an('function');
      return resolvers.Mutation.personUpdate(null, {
        uuid: fakePerson.uuid,
        input: {
          givenName: faker.name.firstName(),
          familyName: faker.name.lastName(),
          gender: (Math.floor(Math.random() * 10) % 2) ? 'F' : 'M',
          telephone: faker.phone.phoneNumber(),
          email: faker.internet.email(),
          type: 'vendor'
        }
      }, context).then((person) => {
        expect(person).to.be.an('object');
        expect(person).to.have.property('uuid');
        expect(person).to.have.property('givenName');
        expect(person).to.have.property('familyName');
        expect(person).to.have.property('gender');
        expect(person).to.have.property('entity');
        expect(person.entity).to.be.an('object');
        expect(person.entity).to.have.property('uuid');
        expect(person.entity).to.have.property('telephone');
        expect(person.entity).to.have.property('email');
        expect(person.entity).to.have.property('type');
      });
    });

    it('personUpdate() should update an person with postalAddresses', function () {
      expect(resolvers.Mutation.personUpdate).to.be.an('function');
      return resolvers.Mutation.personUpdate(null, {
        uuid: fakePerson.uuid,
        input: {
          givenName: faker.name.firstName(),
          familyName: faker.name.lastName(),
          gender: (Math.floor(Math.random() * 10) % 2) ? 'F' : 'M',
          telephone: faker.phone.phoneNumber(),
          email: faker.internet.email(),
          type: 'vendor',
          postalAddresseUuids: fakePerson.entity.postalAddresses.map(postalAddress => postalAddress.uuid).slice(0, 3)
        }
      }, context).then((person) => {
        expect(person).to.be.an('object');
        expect(person).to.have.property('uuid');
        expect(person).to.have.property('givenName');
        expect(person).to.have.property('familyName');
        expect(person).to.have.property('gender');
        expect(person).to.have.property('entity');
        expect(person.entity).to.be.an('object');
        expect(person.entity).to.have.property('uuid');
        expect(person.entity).to.have.property('telephone');
        expect(person.entity).to.have.property('email');
        expect(person.entity).to.have.property('type');
        expect(person.entity).to.have.property('postalAddresses');
        expect(person.entity.postalAddresses).to.be.an('array');
        expect(person.entity.postalAddresses.length).to.equal(3);
      });
    });

    it('personUpdate() should throw an error with wrong uuid', async function () {
      expect(resolvers.Mutation.personUpdate).to.be.an('function');
      const error = await resolvers.Mutation.personUpdate(null, {
        uuid: 123456789,
        input: {
          givenName: faker.name.firstName(),
          familyName: faker.name.lastName(),
          gender: (Math.floor(Math.random() * 10) % 2) ? 'F' : 'M',
          telephone: faker.phone.phoneNumber(),
          email: faker.internet.email(),
          type: 'vendor',
          postalAddresseUuids: fakePerson.entity.postalAddresses.map(postalAddress => postalAddress.uuid).slice(0, 3)
        }
      }, context);
      expect(error).to.be.an.instanceof(Error);
      expect(error.message).to.equal('unknown uuid');
    });

    it('personDelete() should delete a person', function () {
      expect(resolvers.Mutation.personDelete).to.be.an('function');
      return resolvers.Mutation.personDelete(null, {
        uuid: fakePerson.uuid
      }, context).then(result => {
        expect(result).to.be.true;
      });
    });

    it('personDelete() should throw an error with wrong uuid', async function () {
      expect(resolvers.Mutation.personDelete).to.be.an('function');
      const error = await resolvers.Mutation.personDelete(null, {
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
