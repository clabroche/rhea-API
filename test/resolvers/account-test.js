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

const context = { request };

const adminAccount = {
    givenName: faker.name.firstName(),
    familyName: faker.name.lastName(),
    uuid: faker.random.uuid(),
    login: 'johndoe',
    password: '$argon2i$v=19$m=4096,t=3,p=1$CxnnerAwIpnDdqI6bAjG9w$keNau2CHhpwjs54E3fxu6t5jR0DwMeHTw4SY/Em0hWc',
    avatar: faker.system.filePath(),
    role: {
      uuid: faker.random.uuid(),
      name: 'administrator'
    }
};

const adminAccountUuid = adminAccount.uuid;
const administratorRole = adminAccount.role.uuid;

const usersAccounts = Array(10).fill('').map(user => {
  return {
    givenName: faker.name.firstName(),
    familyName: faker.name.lastName(),
    login: faker.internet.userName(),
    password: '$argon2i$v=19$m=4096,t=3,p=1$CxnnerAwIpnDdqI6bAjG9w$keNau2CHhpwjs54E3fxu6t5jR0DwMeHTw4SY/Em0hWc'
  }
});

usersAccounts.push(adminAccount);

describe('src/resolvers/account.js', function () {
  before(function () {
    this.timeout(100000);
    return models.sequelize.sync().then(() => {
      return Promise.map(usersAccounts, (userAccount) => {
        return models.account.create(userAccount, {
          include: [models.role]
        });
      });
    });
  });

  describe('Query', function () {
    it('accounts() should return all account', function () {
      expect(resolvers.Query.accounts).to.be.an('function');
      return resolvers.Query.accounts(null, null, context).then((accounts) => {
        expect(accounts).to.be.an('array');
        accounts.map(account => {
          expect(account).to.be.an('object');
          expect(account).to.have.property('uuid');
          expect(account).to.have.property('login');
          expect(account).to.have.property('password');
          expect(account).to.have.property('givenName');
          expect(account).to.have.property('familyName');
          expect(account).to.have.property('avatar');
        });
      });
    });

    it('accountById() should return an account', function () {
      expect(resolvers.Query.accountById).to.be.an('function');
      return resolvers.Query.accountById(
        null,
        { uuid: adminAccountUuid },
        context
      ).then((account) => {
        expect(account).to.be.an('object');
        expect(account).to.have.property('uuid');
        expect(account).to.have.property('login');
        expect(account).to.have.property('givenName');
        expect(account).to.have.property('familyName');
        expect(account).to.have.property('password');
        expect(account).to.have.property('avatar');
      });
    });
  });

  describe('Mutation', function () {
    it('accountCreate() should create an account', function () {
      expect(resolvers.Mutation.accountCreate).to.be.an('function');
      return resolvers.Mutation.accountCreate(null, {
        input: {
          login: faker.internet.userName(),
          password: faker.internet.password(),
          avatar: faker.system.filePath()
        }
      }, context).then((account) => {
        expect(account).to.be.an('object');
        expect(account).to.have.property('uuid');
        expect(account).to.have.property('login');
        expect(account).to.have.property('givenName');
        expect(account).to.have.property('familyName');
        expect(account).to.have.property('password');
        expect(account).to.have.property('avatar');
      });
    });

    it('accountCreate() should create an account with an user and attached with a role', function () {
      expect(resolvers.Mutation.accountCreate).to.be.an('function');
      return resolvers.Mutation.accountCreate(null, {
        input: {
          login: faker.internet.userName(),
          password: faker.internet.password(),
          avatar: faker.system.filePath(),
          roleUuid: administratorRole
        }
      }, context).then((account) => {
        expect(account).to.be.an('object');
        expect(account).to.have.property('uuid');
        expect(account).to.have.property('login');
        expect(account).to.have.property('password');
        expect(account).to.have.property('avatar');
        expect(account).to.have.property('givenName');
        expect(account).to.have.property('familyName');
      });
    });

    it('accountCreate() should return an error when no password', function () {
      expect(resolvers.Mutation.accountCreate).to.be.an('function');
      return resolvers.Mutation.accountCreate(null, {
        input: {
          login: faker.internet.userName(),
          avatar: faker.system.filePath()
        }
      }, context).catch((error) => {
        expect(error).to.be.an('error');
      });
    });

    it('accountUpdate() should update an account', function () {
      expect(resolvers.Mutation.accountUpdate).to.be.an('function');
      return resolvers.Mutation.accountUpdate(null, {
        uuid: adminAccountUuid,
        input: {
          login: faker.internet.userName(),
          password: faker.internet.password(),
          givenName: faker.name.firstName(),
          familyName: faker.name.lastName(),
          avatar: faker.system.filePath(),
        }
      }, context).then((account) => {
        expect(account).to.be.an('object');
        expect(account).to.have.property('uuid');
        expect(account).to.have.property('login');
        expect(account).to.have.property('password');
        expect(account).to.have.property('avatar');
        expect(account).to.have.property('givenName');
        expect(account).to.have.property('familyName');
      });
    });

    it('accountDelete() should delete an account', function () {
      expect(resolvers.Mutation.accountDelete).to.be.an('function');
      return resolvers.Mutation.accountDelete(null, {
        uuid: adminAccountUuid
      }, context).then(result => {
        expect(result).to.be.true;
      });
    });
  });

  after(function () {
    this.timeout(100000);
    sandbox.restore();
    return models.sequelize.drop();
  });
});
