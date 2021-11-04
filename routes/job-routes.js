let Job = require("../models/job.js");

module.exports = function(app) {

    app.post("/api/jobs/create" , function(req, res){
        let createObj = {};
        for (let col in req.body) {
            createObj[`${col}`] = req.body[col];
        }
        Job.create(createObj)
        .then(function(result){
            res.json(result)
        })
        .catch(function(err) {
            res.status(500).json({error: 'Failed to create job.  Please double check your form has been filled out correctly and try again.'})
        });
    });

    app.put("/api/jobs/update" , function(req, res){
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
    });

    app.put("/api/jobs/archive" , function(req, res){
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
            console.log(err)
            res.status(500).json({error: 'Failed to archive job. Please try again later.'})
        });
    });
};