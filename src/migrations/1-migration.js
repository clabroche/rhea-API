'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "permissions", deps: []
 * createTable "role", deps: []
 * createTable "account", deps: [role]
 * createTable "recipe", deps: [account]
 * createTable "inventory", deps: [account]
 * createTable "category", deps: [account]
 * createTable "item", deps: [account, category]
 * createTable "inventoryItem", deps: [inventory, item]
 * createTable "recipeItem", deps: [recipe, item]
 * createTable "shoppingList", deps: [account]
 * createTable "shoppingListItem", deps: [item, shoppingList]
 * createTable "role_permission", deps: [permissions, role]
 *
 **/

var info = {
    "revision": 1,
    "name": "migration",
    "created": "2018-08-06T17:43:09.680Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "permissions",
            {
                "uuid": {
                    "type": Sequelize.UUID,
                    "primaryKey": true,
                    "defaultValue": Sequelize.UUIDV4
                },
                "name": {
                    "type": Sequelize.STRING,
                    "unique": true
                },
                "description": {
                    "type": Sequelize.STRING
                },
                "createdAt": {
                    "type": Sequelize.DATE
                },
                "updatedAt": {
                    "type": Sequelize.DATE
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "role",
            {
                "uuid": {
                    "type": Sequelize.UUID,
                    "primaryKey": true,
                    "defaultValue": Sequelize.UUIDV4
                },
                "name": {
                    "type": Sequelize.STRING
                },
                "createdAt": {
                    "type": Sequelize.DATE
                },
                "updatedAt": {
                    "type": Sequelize.DATE
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "account",
            {
                "uuid": {
                    "type": Sequelize.UUID,
                    "primaryKey": true,
                    "defaultValue": Sequelize.UUIDV4
                },
                "login": {
                    "type": Sequelize.STRING,
                    "unique": true
                },
                "password": {
                    "type": Sequelize.STRING
                },
                "givenName": {
                    "type": Sequelize.STRING
                },
                "familyName": {
                    "type": Sequelize.STRING
                },
                "avatar": {
                    "type": Sequelize.STRING
                },
                "createdAt": {
                    "type": Sequelize.DATE
                },
                "updatedAt": {
                    "type": Sequelize.DATE
                },
                "roleUuid": {
                    "type": Sequelize.UUID,
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "role",
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
            "recipe",
            {
                "uuid": {
                    "type": Sequelize.UUID,
                    "primaryKey": true,
                    "defaultValue": Sequelize.UUIDV4
                },
                "name": {
                    "type": Sequelize.STRING
                },
                "img": {
                    "type": Sequelize.STRING
                },
                "time": {
                    "type": Sequelize.STRING
                },
                "preparation": {
                    "type": Sequelize.STRING
                },
                "nbPerson": {
                    "type": Sequelize.INTEGER
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
            "inventory",
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
            "category",
            {
                "uuid": {
                    "type": Sequelize.UUID,
                    "primaryKey": true,
                    "defaultValue": Sequelize.UUIDV4
                },
                "name": {
                    "type": Sequelize.STRING
                },
                "updatedAt": {
                    "type": Sequelize.DATE
                },
                "createdAt": {
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
            "item",
            {
                "uuid": {
                    "type": Sequelize.UUID,
                    "primaryKey": true,
                    "defaultValue": Sequelize.UUIDV4
                },
                "name": {
                    "type": Sequelize.STRING
                },
                "description": {
                    "type": Sequelize.STRING
                },
                "price": {
                    "type": Sequelize.FLOAT,
                    "defaultValue": 0
                },
                "updatedAt": {
                    "type": Sequelize.DATE
                },
                "createdAt": {
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
                },
                "categoryUuid": {
                    "type": Sequelize.UUID,
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "category",
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
            "inventoryItem",
            {
                "quantity": {
                    "type": Sequelize.INTEGER
                },
                "createdAt": {
                    "type": Sequelize.DATE
                },
                "updatedAt": {
                    "type": Sequelize.DATE
                },
                "inventoryUuid": {
                    "type": Sequelize.UUID,
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "inventory",
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
    },
    {
        fn: "createTable",
        params: [
            "recipeItem",
            {
                "quantity": {
                    "type": Sequelize.INTEGER
                },
                "createdAt": {
                    "type": Sequelize.DATE
                },
                "updatedAt": {
                    "type": Sequelize.DATE
                },
                "recipeUuid": {
                    "type": Sequelize.UUID,
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "recipe",
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
    },
    {
        fn: "createTable",
        params: [
            "shoppingList",
            {
                "uuid": {
                    "type": Sequelize.UUID,
                    "primaryKey": true,
                    "defaultValue": Sequelize.UUIDV4
                },
                "name": {
                    "type": Sequelize.STRING
                },
                "description": {
                    "type": Sequelize.STRING
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
            "shoppingListItem",
            {
                "quantity": {
                    "type": Sequelize.INTEGER
                },
                "done": {
                    "type": Sequelize.INTEGER
                },
                "createdAt": {
                    "type": Sequelize.DATE
                },
                "updatedAt": {
                    "type": Sequelize.DATE
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
                },
                "shoppingListUuid": {
                    "type": Sequelize.UUID,
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "shoppingList",
                        "key": "uuid"
                    },
                    "primaryKey": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "role_permission",
            {
                "createdAt": {
                    "type": Sequelize.DATE,
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "allowNull": false
                },
                "permissionUuid": {
                    "type": Sequelize.UUID,
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "permissions",
                        "key": "uuid"
                    },
                    "primaryKey": true
                },
                "roleUuid": {
                    "type": Sequelize.UUID,
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "role",
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
