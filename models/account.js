let Sequelize = require("sequelize");
let sequelize = require("../config/connection.js");

const Account = sequelize.define("account", {
    firstname: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lastname: {
        type: Sequelize.STRING,
        allowNull: false,     
    },
    username: {
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
        validate: {
            isEmail: true
        }
    }
});

Account.sync({force: true});

module.exports = Account;
