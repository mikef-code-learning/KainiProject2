let Account = require("../models/account.js");
let Job = require("../models/job.js")


module.exports = function(app) {
    // app.post("api/users/create" , function(req, res){
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
        });
    });

    app.post("api/jobs/create" , function(req, res){
        Job.create({
            companyname: req.body.companyname,
            companyaddress: req.body.companyaddress, 
            position: req.body.position, 
            targetsalary: req.body.targetsalary,
            salariedoffered: req.body.salariedoffered,
            pocname: req.body.pocname,
            pocemailaddress: req.body.pocemailaddress,
            pocphonenumber: req.body.pocphonenumber,
            userid: req.body.userid,
            archived: false
        }).then(function(result){
            res.json(result)
        });
    });

    app.put("api/jobs/update" , function(req, res){
        Job.update({
            companyname: req.body.companyname,
            companyaddress: req.body.companyaddress, 
            position: req.body.position, 
            targetsalary: req.body.targetsalary,
            salariedoffered: req.body.salariedoffered,
            pocname: req.body.pocname,
            pocemailaddress: req.body.pocemailaddress,
            pocphonenumber: req.body.pocphonenumber,
            userid: req.body.userid,
        }, {
            where: {
                id: req.body.id
            }
        })
        .then(function(data){
            res.json(data);
        });
    });

    app.put("api/jobs/archive" , function(req, res){
        Job.update({
            archived: true
        }, {
            where: {
                id: req.body.id
            }
        })
        .then(function(data){
            res.json(data);
        });
    });

};
