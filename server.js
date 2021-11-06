require('dotenv').config();

const express = require("express");
const app = express();
let PORT = process.env.PORT || 3000;
const exphbs = require("express-handlebars");
const mysql = require('mysql');
const crypto = require('crypto');
const session = require('express-session');
const MySQLstore = require('express-mysql-session')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
let Sequelize = require("sequelize");
let sequelize = require("./config/connection.js");
let Account = require("./models/account.js");

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

app.use(express.static("public"));
app.use(session({ 
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: mysqlSessionStore,
    cookie: { expires: cookieExpire }
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require("./routes/html-routes.js")(app);
require("./routes/account-routes.js")(app);
require("./routes/job-routes.js")(app);

passport.use(new LocalStrategy({
        usernameField: 'emailaddress',
        passwordField: 'password'
    },
    async function(username, password, done) {

        var user = await Account.findOne({
            where: {
                emailaddress: username
            }
        });
        if (!user) {
            return done(null, false, { message: 'Incorrect username or password.' });
        }
        
        const hashedPw = crypto.pbkdf2Sync(password, user.dataValues.salt, 10000, 64, 'sha512').toString('base64')

        if (user.dataValues.password != hashedPw) {
            return done(null, false, { message: 'Incorrect username or password.' });
        } else {
            const loggedInUser = {
                id: user.dataValues.id,
                email: user.dataValues.emailaddress,
                firstname: user.dataValues.firstname,
                lastname: user.dataValues.lastname
            };
            return done(null, loggedInUser);
        }
    }
));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        const serializedUser = {
            id: user.id,
            emailaddress: user.emailaddress,
            firstname: user.firstname,
            lastname: user.lastname
        }
        cb(null, serializedUser);
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(async function() {
        const userFound = await Account.findOne({ where: { id: user.id } });
        cb(null, userFound);
    });
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});