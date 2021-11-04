let Sequelize = require("sequelize");
let sequelize = require("../config/connection.js");
let Account = require("./account.js");

const Job = sequelize.define("job", {
    companyname: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    companyaddress:Sequelize.STRING,

    position: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    targetsalary: Sequelize.DECIMAL(20, 2),

    salaryoffered: Sequelize.DECIMAL(20, 2),

    status: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    pocname: Sequelize.STRING,

    pocemailaddress: {
        type: Sequelize.STRING,
        validate: {
            isEmail: true
        }
    },

    pocphonenumber: Sequelize.STRING,

    accountid: { 
        type:Sequelize.INTEGER, 
        allowNull: false
    },

    archived: Sequelize.BOOLEAN
});

// Job.sync({force: true});
Job.sync();

module.exports = Job;