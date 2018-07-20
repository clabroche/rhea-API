'use strict';
const Promise = require('bluebird');
const faker = require('faker');
const models = require('../models');
const randomColor = require('randomcolor');

faker.date.soon = function (days) {
  const date = new Date();
  const range = {
    min: 1000,
    max: (days || 1) * 24 * 3600 * 1000
  };
  const now = date.getTime();
  const future = now + faker.random.number(range);
  date.setTime(future);
  return date;
};

const getRandomItem = function (collection) {
  const randomIndex = Math.floor(Math.random() * collection.length);
  return collection[randomIndex];
};
const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;
const latitudeFrench = () => getRandomArbitrary(47.5395, 49.0739);
const longitudeFrench = () => getRandomArbitrary(3.8754, 7.3938);

module.exports = {
  up: () => {
    return models.sequelize.sync().then(() => {
      const technicianRole = {
        name: 'technician'
      };

      const technicians = Array(10).fill('').map(() => {
        return {
          givenName: faker.name.firstName(),
          familyName: faker.name.lastName(),
          gender: (Math.floor(Math.random() * 10) % 2) ? 'F' : 'M',
          account: {
            login: faker.internet.userName(),
            password: '$argon2i$v=19$m=4096,t=3,p=1$CxnnerAwIpnDdqI6bAjG9w$keNau2CHhpwjs54E3fxu6t5jR0DwMeHTw4SY/Em0hWc'
          },
          entity: {
            telephone: faker.phone.phoneNumber(),
            email: faker.internet.email(),
            type: 'vendor'
          }
        };
      });

      return Promise.join(
        Promise.map(technicians, (user) => {
          return models.person.create(user, {
            include: [models.entity, models.account]
          });
        }),
        models.role.create(technicianRole),
        models.permission.findAll().filter(permission => permission.name.split(':')[1] === 'read'),
        models.organization.findOne({
          where: { name: 'John DOE Compagny' },
          include: [models.entity]
        }),
        function (technicians, technicianRole, readPermissions, organizationVendor) {
          return Promise.all([
            technicianRole.setPermissions(readPermissions),
            Promise.map(technicians, technician => organizationVendor.addPerson(technician)),
            Promise.map(technicians, technician => technician.account.setRole(technicianRole))
          ]);
        }
      );
    }).then(() => {
      const organizationCustomers = Array(10).fill('').map(() => {
        return {
          name: faker.company.companyName(),
          logo: faker.system.filePath(),
          entity: {
            telephone: faker.phone.phoneNumber(),
            email: faker.internet.email(),
            type: 'customer',
            postalAddresses: Array(5).fill('').map(() => {
              return {
                uuid: faker.random.uuid(),
                name: faker.random.words(3),
                streetAddress: faker.address.streetAddress(),
                postalCode: faker.address.zipCode(),
                addressLocality: faker.address.city(),
                latitude: latitudeFrench(),
                longitude: longitudeFrench(),
                buildings: Array(3).fill('').map(() => {
                  return {
                    uuid: faker.random.uuid(),
                    name: faker.random.word(),
                    type: faker.random.word(),
                    color: faker.internet.color(),
                    latitude: latitudeFrench(),
                    longitude: longitudeFrench(),
                    levels: Array(3).fill('').map(() => {
                      return {
                        uuid: faker.random.uuid(),
                        code: faker.random.alphaNumeric()
                      };
                    })
                  };
                })
              };
            })
          }
        };
      });

      const personCustomers = Array(10).fill('').map(() => {
        return {
          givenName: faker.name.firstName(),
          familyName: faker.name.lastName(),
          gender: (Math.floor(Math.random() * 10 % 2)) ? 'F' : 'M',
          entity: {
            telephone: faker.phone.phoneNumber(),
            email: faker.internet.email(),
            type: 'customer',
            postalAddresses: Array(5).fill('').map(() => {
              return {
                uuid: faker.random.uuid(),
                name: faker.random.words(3),
                streetAddress: faker.address.streetAddress(),
                postalCode: faker.address.zipCode(),
                addressLocality: faker.address.city(),
                latitude: latitudeFrench(),
                longitude: longitudeFrench(),
                buildings: Array(3).fill('').map(() => {
                  return {
                    uuid: faker.random.uuid(),
                    name: faker.random.word(),
                    type: faker.random.word(),
                    color: faker.internet.color(),
                    latitude: latitudeFrench(),
                    longitude: longitudeFrench(),
                    levels: Array(3).fill('').map(() => {
                      return {
                        uuid: faker.random.uuid(),
                        code: faker.random.alphaNumeric()
                      };
                    })
                  };
                })
              };
            })
          }
        };
      });

      return Promise.join(
        Promise.map(organizationCustomers, (organizationCustomer) => {
          return models.organization.create(organizationCustomer, {
            include: [{
              model: models.entity,
              include: {
                model: models.postalAddress,
                include: [{
                  model: models.building,
                  include: [models.level]
                }]
              }
            }]
          });
        }),
        Promise.map(personCustomers, (personCustomer) => {
          return models.person.create(personCustomer, {
            include: [{
              model: models.entity,
              include: {
                model: models.postalAddress,
                include: [{
                  model: models.building,
                  include: [models.level]
                }]
              }
            }]
          });
        }),
        models.organization.findOne({
          where: { name: 'John DOE Compagny' },
          include: [models.entity]
        }),
        function (organizationCustomers, personCustomers, organizationVendor) {
          return Promise.all([
            Promise.map(organizationCustomers, organizationCustomer => {
              return organizationVendor.entity.addCustomer(organizationCustomer.entity);
            }),
            Promise.map(personCustomers, personCustomer => {
              return organizationVendor.entity.addCustomer(personCustomer.entity);
            })
          ]);
        }
      );
    }).then(() => {
      const offers = Array(3).fill('').map(() => {
        return {
          aviabilyStarts: faker.date.past(10),
          aviabilyEnds: faker.date.future(2),
          color: randomColor({ luminosity: 'light' }),
          price: faker.commerce.price(),
          category: faker.lorem.word(),
          services: Array(3).fill('').map(() => {
            return {
              name: faker.lorem.word(2),
              description: faker.lorem.words(15)
            };
          })
        };
      });

      return Promise.join(
        models.organization.findOne({
          where: { name: 'John DOE Compagny' },
          include: [models.entity]
        }),
        Promise.map(offers, (offer) => {
          return models.offer.create(offer, {
            include: [models.service]
          });
        }),
        function (organizationVendor, offers) {
          return Promise.map(offers, offer => organizationVendor.addOffer(offer));
        }
      );
    }).then(() => {
      return models.entity.findAll({ where: { type: 'customer' } }).map(customer => {
        const actions = Array(5).fill('').map(() => {
          const planDate = faker.date.soon(30);
          const [planActionEstimated, planActionMorning, planActionAfternoon] = Array(3).fill('').map(() => {
            return {
              start: new Date(planDate),
              end: new Date(planDate),
              description: faker.lorem.words(50)
            };
          });
          planActionEstimated.type = 'estimated';
          planActionEstimated.start.setHours(8, 0);
          planActionEstimated.end.setHours(17, 0);
          planActionMorning.start.setHours(9, 0);
          planActionMorning.end.setHours(11, 30);
          planActionMorning.type = 'real';
          planActionAfternoon.start.setHours(14, 0);
          planActionAfternoon.end.setHours(16, 45);
          planActionAfternoon.type = 'real';
          const planActions = [planActionEstimated, planActionMorning, planActionAfternoon];

          return {
            description: faker.lorem.words(50),
            planActions
          };
        });

        return Promise.map(actions, action => {
          return Promise.join(
            models.action.create(action, { include: [models.planAction] }),
            models.offer.findAll().then(offers => getRandomItem(offers)),
            models.organization.findOne({
              where: { name: 'John DOE Compagny' },
              include: [models.entity]
            }).then(vendor => vendor.getPeople()),
            function (action, offer, people) {
              return Promise.all([
                action.setOffer(offer),
                action.setEntity(customer),
                Promise.map(action.planActions, planAction => planAction.setPerson(getRandomItem(people)))
              ]).then(() => action);
            }
          );
        }).map(action => {
          return Promise.join(
            customer.getPostalAddresses(),
            models.locationAction.create(),
            function (postalAddresses, locationAction) {
              return locationAction.setPostalAddress(getRandomItem(postalAddresses));
            }
          ).then(locationAction => {
            return action.addLocationAction(locationAction);
          }).then(() => {
            return models.action.findById(action.uuid, { include: [{ all: true }] });
          }).then(action => {
            return Promise.map(action.planActions, planAction => planAction.addLocationAction(action.locationActions[0]));
          });
        });
      });
    });
  },
  down: () => {
    return Promise.resolve().then(() => {
      return models.sequelize.drop();
    });
  }
};
