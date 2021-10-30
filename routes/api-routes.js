let Account = require("../models/account.js");
let Job = require("../models/job.js")


module.exports = function(app) {
    // app.post("/api/users/create" , function(req, res){
    //     Account.create({
    //         firstname: req.body.firstname,
    //         lastname: req.body.lastname,
    //         username: req.body.username, 
    //         password: req.body.password, 
    //         emailaddress: req.body.emailaddress
    //     }).then(function(result){
    //         res.json(result)
    //     });
    // });

    app.get("/" , function(req, res){
        // if account logged in, res.render
        Job.findAll({}).then(function(data) {
            let jobObject = {
                job: data
            }
            res.render("index", jobObject)
        }).catch(function(err) {
            console.log(err)
            res.status(500).json({error: 'Failed to get jobs.  Please try again later.'})
        });
    });

    app.post("/api/jobs/create" , function(req, res){
            Job.create({
                companyname: req.body.companyname,
                companyaddress: req.body.companyaddress, 
                position: req.body.position, 
                targetsalary: req.body.targetsalary,
                salaryoffered: req.body.salaryoffered,
                pocname: req.body.pocname,
                pocemailaddress: req.body.pocemailaddress,
                pocphonenumber: req.body.pocphonenumber,
                userid: req.body.userid,
                status: req.body.status,
                archived: false
            }).then(function(result){
                res.json(result)
            }).catch(function(err) {
                res.status(500).json({error: 'Failed to create job.  Please double check your form has been filled out correctly and try again.'})
            });
    });

    app.put("/api/jobs/update" , function(req, res){
        let updateObj = {};
        for (col in req.body) {
            updateObj[`${col}`] = req.body[col]
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
            res.status(500).json({error: 'Failed to update job. Please try again later.'})
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
        });;
    });

};
