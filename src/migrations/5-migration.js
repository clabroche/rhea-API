'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * changeColumn "date" on table "calendarRecipe"
 *
 **/

var info = {
    "revision": 5,
    "name": "migration",
    "created": "2018-08-11T18:40:52.327Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "changeColumn",
    params: [
        "calendarRecipe",
        "date",
        {
            "type": Sequelize.DATE
        }
    ]
}];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
