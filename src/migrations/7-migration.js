'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * changeColumn "recipeUuid" on table "calendarRecipe"
 * changeColumn "recipeUuid" on table "calendarRecipe"
 * changeColumn "recipeUuid" on table "calendarRecipe"
 * changeColumn "recipeUuid" on table "calendarRecipe"
 * changeColumn "calendarUuid" on table "calendarRecipe"
 * changeColumn "calendarUuid" on table "calendarRecipe"
 * changeColumn "calendarUuid" on table "calendarRecipe"
 * changeColumn "calendarUuid" on table "calendarRecipe"
 *
 **/

var info = {
    "revision": 7,
    "name": "migration",
    "created": "2018-08-11T22:07:11.684Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "changeColumn",
        params: [
            "calendarRecipe",
            "recipeUuid",
            {
                "type": Sequelize.UUID
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "calendarRecipe",
            "recipeUuid",
            {
                "type": Sequelize.UUID
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "calendarRecipe",
            "recipeUuid",
            {
                "type": Sequelize.UUID
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "calendarRecipe",
            "recipeUuid",
            {
                "type": Sequelize.UUID
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "calendarRecipe",
            "calendarUuid",
            {
                "type": Sequelize.UUID
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "calendarRecipe",
            "calendarUuid",
            {
                "type": Sequelize.UUID
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "calendarRecipe",
            "calendarUuid",
            {
                "type": Sequelize.UUID
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "calendarRecipe",
            "calendarUuid",
            {
                "type": Sequelize.UUID
            }
        ]
    }
];

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
