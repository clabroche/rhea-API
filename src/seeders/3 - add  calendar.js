'use strict';

const Promise = require('bluebird');
const models = require('../models');

module.exports = {
  up: () => {
    return models.account.findAll().then(async accounts=>{

      await Promise.map(accounts,  async account=>{
        const calendar = await models.calendar.create()
        await account.setCalendar(calendar)
      })
    })
  },
  down: () => {
    return Promise.resolve().then(() => {
      return models.sequelize.drop();
    });
  }
};
