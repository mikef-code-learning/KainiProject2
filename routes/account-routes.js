const Account = require("../models/account.js");
const Job = require("../models/job.js");
const passport = require('passport');
const crypto = require('crypto');

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
            var emailExists = await Account.findOne({
                where: {
                    emailaddress: email
                }
            });
            if (!emailExists) {
                var user = await Account.create({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    emailaddress: email,
                    password: password,
                    salt: salt
                });
                if (user) {
                    return res.json({status: 'ok', message: 'Account created successfully! Please log in.'});
                }
            } else {
                return res.json({status: 'ok', message: 'There was an error creating your account.  Check your email and password, make sure an account does not already exist with this email address, and try again.'});
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
            } else {
                req.login(user, function(err) {
                    if (err) {
                        return res.json({ status: 'error', message: 'Login failed.' });
                    } else {
                        return res.json({ status: 'ok', message: 'Login successful.' });
                    }
                });
            }
        })(req, res, next);
    });

    app.get('/api/account/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};