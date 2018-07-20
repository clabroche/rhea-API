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

const level = {
  uuid: faker.random.uuid(),
  code: faker.random.number()
};

describe('src/resolvers/level.js', function () {
  before(function () {
    this.timeout(100000);
    return models.sequelize.sync().then(() => {
      return models.level.create(level);
    });
  });

  describe('Query', function () {
    it('levels() should return all levels', function () {
      expect(resolvers.Query.levels).to.be.an('function');
      return resolvers.Query.levels(null, null, context).then((levels) => {
        expect(levels).to.be.an('array');
        levels.map(level => {
          expect(level).to.be.an('object');
          expect(level).to.have.property('code');
        });
      });
    });

    it('level() should return an level', function () {
      expect(resolvers.Query.levelById).to.be.an('function');
      return resolvers.Query.levelById(null, { uuid: level.uuid }, context).then((level) => {
        expect(level).to.be.an('object');
        expect(level).to.have.property('code');
      });
    });
  });

  describe('Mutation', function () {
    it('levelCreate() should create a level', function () {
      expect(resolvers.Mutation.levelCreate).to.be.an('function');
      return resolvers.Mutation.levelCreate(null, {
        input: {
          code: 'B123'
        }
      }, context).then((level) => {
        expect(level).to.be.an('object');
        expect(level).to.have.property('code');
      });
    });

    it('levelUpdate() should update an level', function () {
      expect(resolvers.Mutation.levelUpdate).to.be.an('function');
      return resolvers.Mutation.levelUpdate(null, {
        uuid: level.uuid,
        input: {
          code: 'D456'
        }
      }, context).then((level) => {
        expect(level).to.be.an('object');
        expect(level).to.have.property('code');
        expect(level.code).to.equal('D456');
      });
    });

    it('levelUpdate() should throw an error with wrong uuid', async function () {
      expect(resolvers.Mutation.levelUpdate).to.be.an('function');
      const error = await resolvers.Mutation.levelUpdate(null, {
        uuid: 123456789,
        input: {
          code: 'R2D2'
        }
      }, context);
      expect(error).to.be.an.instanceof(Error);
      expect(error.message).to.equal('unknown uuid');
    });

    it('levelDelete() should delete a level', function () {
      expect(resolvers.Mutation.levelDelete).to.be.an('function');
      return resolvers.Mutation.levelDelete(null, {
        uuid: level.uuid
      }, context);
    });

    it('levelDelete() should throw an error with wrong uuid', async function () {
      expect(resolvers.Mutation.levelDelete).to.be.an('function');
      const error = await resolvers.Mutation.levelDelete(null, {
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
