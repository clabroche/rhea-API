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
const context = { request };

const action = {
  description: faker.lorem.words(50)
};
const postalAddress = {
  uuid: faker.random.uuid(),
  name: faker.random.words(3),
  streetAddress: faker.address.streetAddress(),
  postalCode: faker.address.zipCode(),
  addressLocality: faker.address.city(),
  latitude: faker.address.latitude(),
  longitude: faker.address.longitude()
};
const building = {
  uuid: faker.random.uuid(),
  name: faker.random.word(),
  type: faker.random.word(),
  latitude: faker.address.latitude(),
  longitude: faker.address.longitude()
};
const level = {
  uuid: faker.random.uuid(),
  code: faker.random.number()
};
const planActions = Array(2).fill('').map(() => {
  return {
    uuid: faker.random.uuid(),
    start: new Date(),
    end: new Date(),
    description: faker.lorem.words(50)
  };
});
const locationAction = {
  uuid: faker.random.uuid(),
  action,
  postalAddress,
  building,
  level,
  planActions
};

describe('src/resolvers/locationAction.js', function () {
  before(function () {
    this.timeout(100000);
    return models.sequelize.sync().then(() => {
      return models.locationAction.create(locationAction, {
        include: [
          models.action,
          models.postalAddress,
          models.building,
          models.level,
          models.planAction
        ]
      });
    });
  });

  describe('Query', function () {
    it('locationActions() should return all locationActions', function () {
      expect(resolvers.Query.locationActions).to.be.an('function');
      return resolvers.Query.locationActions(null, null, context).then((locationActions) => {
        expect(locationActions).to.be.an('array');
        locationActions.map(locationAction => {
          expect(locationAction).to.be.an('object');
        });
      });
    });

    it('actionByID() should return an locationAction', function () {
      expect(resolvers.Query.locationActionById).to.be.an('function');
      return resolvers.Query.locationActionById(null, { uuid: locationAction.uuid }, context).then((locationAction) => {
        expect(locationAction).to.be.an('object');
      });
    });
  });

  describe('locationAction', function () {
    it('action() should return action attached to this locationAction', function () {
      expect(resolvers.LocationAction.action).to.be.an('function');
      return resolvers.Query.locationActionById(null, { uuid: locationAction.uuid }, context).then(locationAction => {
        return resolvers.LocationAction.action(locationAction, null, context);
      }).then(action => {
        expect(action).to.be.an('object');
      });
    });

    it('postalAddress() should return postalAddress attached to this locationAction', function () {
      expect(resolvers.LocationAction.postalAddress).to.be.an('function');
      return resolvers.Query.locationActionById(null, { uuid: locationAction.uuid }, context).then(locationAction => {
        return resolvers.LocationAction.postalAddress(locationAction, null, context);
      }).then(postalAddress => {
        expect(postalAddress).to.be.an('object');
      });
    });

    it('building() should return building attached to this locationAction', function () {
      expect(resolvers.LocationAction.building).to.be.an('function');
      return resolvers.Query.locationActionById(null, { uuid: locationAction.uuid }, context).then(locationAction => {
        return resolvers.LocationAction.building(locationAction, null, context);
      }).then(building => {
        expect(building).to.be.an('object');
      });
    });

    it('level() should return level attached to this locationAction', function () {
      expect(resolvers.LocationAction.level).to.be.an('function');
      return resolvers.Query.locationActionById(null, { uuid: locationAction.uuid }, context).then(locationAction => {
        return resolvers.LocationAction.level(locationAction, null, context);
      }).then(level => {
        expect(level).to.be.an('object');
      });
    });

    it('planning() should return all planAction', function () {
      expect(resolvers.LocationAction.planning).to.be.an('function');
      return resolvers.Query.locationActionById(null, { uuid: locationAction.uuid }, context).then(action => {
        return resolvers.LocationAction.planning(action, null, context);
      }).then(planActions => {
        expect(planActions).to.be.an('array');
        expect(planActions.length).to.equal(2);
        planActions.map(planAction => expect(planAction).to.be.an('object'));
      });
    });
  });

  after(function () {
    this.timeout(100000);
    sandbox.restore();
    return models.sequelize.drop();
  });
});
