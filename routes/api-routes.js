let Info = require("../models/model.js");


module.exports = function(app) {
    app.get("/" , function(req, res){
        Info.findAll({}).then(function(data) {
            let infoObject = {
                info: data
            }
            res.render("index", infoObject)
        });
    })



    app.post("api/new" , function(req, res){
        Info.create({
            name: req.body.name,
            username: req.body.username, 
            password: req.body.password, 
        }).then(function(result){
            res.end();
        });
    });
};