let Sequelize = require("sequelize");
let sequelize = require("../config/connection.js");

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

    status: Sequelize.INTEGER,

    pocname: Sequelize.STRING,

    pocemailaddress: {
        type: Sequelize.STRING,
        validate: {
            isEmail: true
        }
    },

    pocphonenumber: Sequelize.STRING,

    userid: Sequelize.INTEGER,

    archived: Sequelize.BOOLEAN
});

Job.sync({force: true});

module.exports = Job;