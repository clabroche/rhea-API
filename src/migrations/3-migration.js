'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "calendar", deps: [account]
 * createTable "calendarRecipe", deps: [calendar, item]
 *
 **/

var info = {
    "revision": 3,
    "name": "migration",
    "created": "2018-08-11T11:30:59.647Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "calendar",
            {
                "uuid": {
                    "type": Sequelize.UUID,
                    "primaryKey": true,
                    "defaultValue": Sequelize.UUIDV4
                },
                "createdAt": {
                    "type": Sequelize.DATE
                },
                "updatedAt": {
                    "type": Sequelize.DATE
                },
                "accountUuid": {
                    "type": Sequelize.UUID,
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "account",
                        "key": "uuid"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "calendarRecipe",
            {
                "date": {
                    "type": Sequelize.INTEGER
                },
                "createdAt": {
                    "type": Sequelize.DATE
                },
                "updatedAt": {
                    "type": Sequelize.DATE
                },
                "calendarUuid": {
                    "type": Sequelize.UUID,
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "calendar",
                        "key": "uuid"
                    },
                    "primaryKey": true
                },
                "itemUuid": {
                    "type": Sequelize.UUID,
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "item",
                        "key": "uuid"
                    },
                    "primaryKey": true
                }
            },
            {}
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
