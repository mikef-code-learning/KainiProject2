module.exports = function(app) {
    app.get("/" , function(req, res){
        res.render("login");
    });

    app.get('/api/test/success', function(req, res) {
        res.render('success');
    });

    app.get('/api/test/fail', function(req, res) {
        res.render('fail');
    });

};
