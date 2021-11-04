let Sequelize = require("sequelize");
let sequelize = require("../config/connection.js");
let Job = require("./job.js");
const crypto = require('crypto');

const Account = sequelize.define("account", {
    firstname: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lastname: {
        type: Sequelize.STRING,
        allowNull: false,     
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,  
    },
    emailaddress: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    salt: {
        type: Sequelize.STRING
    },
    last_login: {
        type: Sequelize.DATE
    }
});

Account.hasMany(Job);
Job.belongsTo(Account);

// Account.sync({force: true});
Account.sync();

module.exports = Account;
