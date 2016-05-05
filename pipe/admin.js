var jwt = require('jsonwebtoken');
var config = require('../config');

module.exports = function(loginUrl) {
    return function (req, res, next) {
        if(req.session.admin) return next();

        jwt.verify(req.cookies.token, config.secret, function(err, json) {
            if(err) return res.redirect(loginUrl);

            models.Admin.findById(json.adminId).exec().then(function(admin) {
                if(!admin) {
                    return res.redirect(loginUrl);
                }

                req.session.admin = admin;

                next();
            });
        });
    };
};