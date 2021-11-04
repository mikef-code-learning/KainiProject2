require('dotenv').config();

const express = require("express");
const app = express();
let PORT = process.env.PORT || 3000;
const exphbs = require("express-handlebars");
const mysql = require('mysql');
const session = require('express-session');
const MySQLstore = require('express-mysql-session')(session);
const passport = require('passport');
let Sequelize = require("sequelize");
let sequelize = require("./config/connection.js");
let User = require("./models/account.js");

// set expiration date of login cookie
let cookieExpire = new Date();
cookieExpire.setDate(cookieExpire.getDate() + 1);

// connect to sessions table using mysql
const mysqlConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DB
});

const mysqlSessionStore = new MySQLstore({
    checkExpirationInterval: parseInt(process.env.DB_CHECK_EXP_INTERVAL, 10),
    expiration: parseInt(process.env.DB_EXPIRATION, 10)
}, mysqlConnection);

app.use(session({ 
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mysqlSessionStore,
    cookie: { expires: cookieExpire }
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require("./routes/html-routes.js")(app);
require("./routes/account-routes.js")(app);
require("./routes/job-routes.js")(app);

passport.serializeUser(function(user, cb) {
    cb(null, {id: user.id, email: user.email, firstname: user.firstname, lastname: user.lastname});
});

passport.deserializeUser(function(user, cb) {
    cb(null, {id: user.id, email: user.email, firstname: user.firstname, lastname: user.lastname});
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});