'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * changeColumn "preparation" on table "recipe"
 *
 **/

var info = {
    "revision": 2,
    "name": "migration",
    "created": "2018-08-06T17:58:32.331Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "changeColumn",
    params: [
        "recipe",
        "preparation",
        {
            "type": Sequelize.TEXT
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
