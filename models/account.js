let Sequelize = require("sequelize");
const passportLocalSequelize = require('passport-local-sequelize');
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
    },
    salt: {
        type: Sequelize.STRING
    }
});

passportLocalSequelize.attachToUser(Account, {
    usernameField: emailaddress,

});

Account.sync({force: true});
// Account.sync();

module.exports = Account;
