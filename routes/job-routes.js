let Job = require("../models/job.js");

module.exports = function(app) {

    app.get('/api/jobs/getall', function(req, res) {
        console.log('inside /api/job/getall.  req.user:')
        console.log(req.user)
        console.log('~~~~~~~~~~~~~~~~~~~~~')
        Job.findAll({
            where: {
                accountid: req.user.id
            }
        }).then(function(data){
            res.json(data);
        })
    });

    app.post("/api/jobs/create" , function(req, res){
        if (req.isAuthenticated()) {
            let createObj = {};
            for (let col in req.body) {
                createObj[`${col}`] = req.body[col];
            }
            createObj.accountid = 1;
            console.log(createObj);
            Job.create(createObj)
            .then(function(result){
                res.json(result);
            })
            .catch(function(err) {
                console.log(err);
                res.status(500).json({error: 'Failed to create job.  Please double check your form has been filled out correctly and try again.'});
            });
        } else {
            res.render('login');
        }
    });

    app.put("/api/jobs/update" , function(req, res){
        if (req.isAuthenticated()) {
            let updateObj = {};
            for (let col in req.body) {
                updateObj[`${col}`] = req.body[col];
            };
            Job.update(updateObj, {
                where: {
                    id: req.body.id
                }
            })
            .then(function(data){
                res.json(data);
            }).catch(function(err) {
                console.log(err)
                res.status(500).json({error: 'Failed to update job. Please try again later.'});
            });
        } else {
            res.render('login');
        }
    });

    app.put("/api/jobs/archive" , function(req, res){
        if (req.isAuthenticated()) {
            Job.update({
                archived: true
            }, {
                where: {
                    id: req.body.id
                }
            })
            .then(function(data){
                res.json(data);
            }).catch(function(err) {
                console.log(err);
                res.status(500).json({error: 'Failed to archive job. Please try again later.'});
            });
        } else {
            res.render('login');
        }
    });
};