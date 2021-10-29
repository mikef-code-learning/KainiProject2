let Sequelize = require("sequelize");
let sequelize = require("../config/connection.js");

const Info = sequelize.define("info", {
    name: Sequelize.STRING,
    username: Sequelize.STRING, 
    password: Sequelize.STRING, 
});

Info.sync();

module.exports = Info;
