module.exports = function(app) {
    app.get("/" , function(req, res){
        console.log(req.isAuthenticated());
        if (req.user) {
            res.render("index");
        } else {
            res.render("login");
        }
    });

    let Job = require("../models/job.js");

    app.get('/api/test/success', function(req, res) {
        // query the job data
        Job.findAll({}).then(function(data){
            //console.log(data);
            res.json(data);
            //var accountID = data[0].accountid;
            //console.log(accountID)
        })
        // send the query results in JSON to frontend
    });

    app.get('/api/test/fail', function(req, res) {
        res.render('fail');
    });


};
