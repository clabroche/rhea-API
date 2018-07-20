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
faker.date.soon = function (days) {
  const date = new Date();
  const range = {
    min: 1000,
    max: (days || 1) * 24 * 3600 * 1000
  };
  let future = date.getTime();
  future += faker.random.number(range); // some time from now to N days later, in milliseconds
  date.setTime(future);
  return date;
};

const context = { request };
const customerOrganization = {
  uuid: faker.random.uuid(),
  telephone: faker.phone.phoneNumber(),
  email: faker.internet.email(),
  type: 'customer',
  organization: {
    uuid: faker.random.uuid(),
    name: faker.company.companyName(),
    logo: faker.system.filePath()
  }
};
const customerPerson = {
  uuid: faker.random.uuid(),
  telephone: faker.phone.phoneNumber(),
  email: faker.internet.email(),
  type: 'customer',
  person: {
    uuid: faker.random.uuid(),
    givenName: faker.name.firstName(),
    familyName: faker.name.lastName()
  }
};
const offer = {
  aviabilyStarts: faker.date.past(10),
  aviabilyEnds: faker.date.future(2),
  price: faker.commerce.price(),
  category: faker.lorem.word()
};
const planDate = faker.date.soon(30);
const [planActionMorning, planActionAfternoon] = Array(2).fill('').map(() => {
  return {
    start: new Date(planDate),
    end: new Date(planDate),
    description: faker.lorem.words(50)
  };
});
planActionMorning.start.setHours(9, 0);
planActionMorning.end.setHours(11, 30);
planActionAfternoon.start.setHours(14, 0);
planActionAfternoon.end.setHours(16, 45);
const planActions = [planActionMorning, planActionAfternoon];
const [actionOrganization, actionPerson] = Array(2).fill('').map(() => {
  const locationActions = Array(2).fill('').map(() => {
    return { uuid: faker.random.uuid() };
  });
  return {
    uuid: faker.random.uuid(),
    description: faker.lorem.words(50),
    offer,
    planActions,
    locationActions
  };
});

actionOrganization.entity = customerOrganization;
actionPerson.entity = customerPerson;

describe('src/resolvers/action.js', function () {
  before(function () {
    this.timeout(100000);
    return models.sequelize.sync().then(() => {
      return models.action.create(actionOrganization, {
        include: [models.planAction, models.locationAction, models.offer, {
          model: models.entity,
          include: [models.organization]
        }]
      }).then(() => {
        return models.action.create(actionPerson, {
          include: [models.planAction, models.locationAction, models.offer, {
            model: models.entity,
            include: [models.person]
          }]
        });
      });
    });
  });

  describe('Query', function () {
    it('actions() should return all actions', function () {
      expect(resolvers.Query.actions).to.be.an('function');
      return resolvers.Query.actions(null, null, context).then((actions) => {
        expect(actions).to.be.an('array');
        actions.map(action => {
          expect(action).to.be.an('object');
          expect(action).to.have.property('description');
        });
      });
    });

    it('actionByID() should return an action', function () {
      expect(resolvers.Query.actionById).to.be.an('function');
      return resolvers.Query.actionById(null, { uuid: actionOrganization.uuid }, context).then((action) => {
        expect(action).to.be.an('object');
        expect(action).to.have.property('description');
      });
    });
  });

  describe('Action', function () {
    it('customer() should return organization customer attached to this action', function () {
      expect(resolvers.Action.customer).to.be.an('function');
      return resolvers.Query.actionById(null, { uuid: actionOrganization.uuid }, context).then(action => {
        return resolvers.Action.customer(action, null, context);
      }).then(customer => {
        expect(customer).to.be.an('object');
      });
    });

    it('customer() should return person customer attached to this action', function () {
      expect(resolvers.Action.customer).to.be.an('function');
      return resolvers.Query.actionById(null, { uuid: actionPerson.uuid }, context).then(action => {
        return resolvers.Action.customer(action, null, context);
      }).then(customer => {
        expect(customer).to.be.an('object');
      });
    });

    it('offer() should return offer attached to this action', function () {
      expect(resolvers.Action.offer).to.be.an('function');
      return resolvers.Query.actionById(null, { uuid: actionOrganization.uuid }, context).then(action => {
        return resolvers.Action.offer(action, null, context);
      }).then(offer => {
        expect(offer).to.be.an('object');
      });
    });

    it('planning() should return all planAction', function () {
      expect(resolvers.Action.planning).to.be.an('function');
      return resolvers.Query.actionById(null, { uuid: actionOrganization.uuid }, context).then(action => {
        return resolvers.Action.planning(action, null, context);
      }).then(planActions => {
        expect(planActions).to.be.an('array');
        expect(planActions.length).to.equal(2);
        planActions.map(planAction => expect(planAction).to.be.an('object'));
      });
    });

    it('location() should return all location', function () {
      expect(resolvers.Action.location).to.be.an('function');
      return resolvers.Query.actionById(null, { uuid: actionOrganization.uuid }, context).then(action => {
        return resolvers.Action.location(action, null, context);
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
