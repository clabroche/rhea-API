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
const person = {
  uuid: faker.random.uuid(),
  givenName: faker.name.firstName(),
  familyName: faker.name.lastName(),
  gender: (Math.floor(Math.random() * 10) % 2) ? 'F' : 'M'
};
const locationActions = Array(2).fill('').map(() => {
  return { uuid: faker.random.uuid() };
});
const planAction = {
  uuid: faker.random.uuid(),
  start: new Date(),
  end: new Date(),
  description: faker.lorem.words(50),
  action,
  person,
  locationActions
};

describe('src/resolvers/planAction.js', function () {
  before(function () {
    this.timeout(100000);
    return models.sequelize.sync().then(() => {
      return models.planAction.create(planAction, {
        include: [models.action, models.person, models.locationAction]
      });
    });
  });

  describe('Query', function () {
    it('planActions() should return all planActions', function () {
      expect(resolvers.Query.planActions).to.be.an('function');
      return resolvers.Query.planActions(null, null, context).then((planActions) => {
        expect(planActions).to.be.an('array');
        planActions.map(planAction => {
          expect(planAction).to.be.an('object');
          expect(planAction).to.have.property('start');
          expect(planAction).to.have.property('end');
          expect(planAction).to.have.property('description');
        });
      });
    });

    it('actionByID() should return an planAction', function () {
      expect(resolvers.Query.planActionById).to.be.an('function');
      return resolvers.Query.planActionById(null, { uuid: planAction.uuid }, context).then((planAction) => {
        expect(planAction).to.be.an('object');
        expect(planAction).to.have.property('start');
        expect(planAction).to.have.property('end');
        expect(planAction).to.have.property('description');
      });
    });
  });

  describe('PlanAction', function () {
    it('action() should return action attached to this planAction', function () {
      expect(resolvers.PlanAction.action).to.be.an('function');
      return resolvers.Query.planActionById(null, { uuid: planAction.uuid }, context).then(planAction => {
        return resolvers.PlanAction.action(planAction, null, context);
      }).then(action => {
        expect(action).to.be.an('object');
      });
    });

    it('agent() should return agent attached to this planAction', function () {
      expect(resolvers.PlanAction.agent).to.be.an('function');
      return resolvers.Query.planActionById(null, { uuid: planAction.uuid }, context).then(planAction => {
        return resolvers.PlanAction.agent(planAction, null, context);
      }).then(agent => {
        expect(agent).to.be.an('object');
      });
    });

    it('location() should return all location', function () {
      expect(resolvers.PlanAction.location).to.be.an('function');
      return resolvers.Query.planActionById(null, { uuid: planAction.uuid }, context).then(action => {
        return resolvers.PlanAction.location(action, null, context);
      }).then(locationActions => {
        expect(locationActions).to.be.an('array');
        expect(locationActions.length).to.equal(2);
        locationActions.map(locationAction => expect(locationAction).to.be.an('object'));
      });
    });
  });

  after(function () {
    this.timeout(100000);
    sandbox.restore();
    return models.sequelize.drop();
  });
});
