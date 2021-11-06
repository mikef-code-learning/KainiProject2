let Account = require("../models/account.js");
let Job = require("../models/job.js");
let passport = require('passport');
let crypto = require('crypto');
let LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
        usernameField: 'emailaddress',
        passwordField: 'password'
    },
    async function(username, password, done) {
        console.log('executing LocalStrategy.');
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
        var user = await Account.findOne({
            where: {
                emailaddress: username
            }
        });
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        
        const userPassword = crypto.pbkdf2Sync(password, user.dataValues.salt, 10000, 64, 'sha512').toString('base64');

        if (userPassword !== user.dataValues.password) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
    }
));

module.exports = function(app) {
    app.post("/api/account/create" , async function(req, res, next) {
        var salt = crypto.randomBytes(64).toString('hex');
        var password = crypto.pbkdf2Sync(req.body.password, salt, 10000, 64, 'sha512').toString('base64');
        
        // if (!isValidPassword(req.body.password)) {
        //     return res.json({status: 'error', message: 'Password must be 8 or more characters.'});
        // }
        // if (!isValidEmail(req.body.email)) {
        //     return res.json({status: 'error', message: 'Email address not formed correctly.'});
        // }
        
        try {
            var email = req.body.emailaddress.toLowerCase();
            // var emailExists = await Account.findOne({
            //     where: {
            //         emailaddress: email
            //     }
            // });
            // if (!emailExists) {
                var user = await Account.create({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    emailaddress: email,
                    password: password,
                    salt: salt
                });
            // }
            if (user) {
                res.json({status: 'OK', message: 'Account created successfully! Please log in.'});
            } else {

            }
        } catch (err) {
            console.log(err);
            return res.json({status: 'error', message: err.errors[0].message});
        }
    });
    
    app.post('/api/account/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { 
                return next(err); 
            }
            if (!user) {
                return res.json({status: 'error', message: info.message});
            }
            user.getJobs().then(function(jobs) {
                return res.redirect('/');
            });
        })(req, res, next);
    });

    app.get('/api/account/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};