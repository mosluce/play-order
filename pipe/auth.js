var jwt = require('jsonwebtoken');
var config = require('../config');

module.exports = function(loginUrl) {
    return function (req, res, next) {
        if(req.session.user) return next();

        jwt.verify(req.cookies.token, config.secret, function(err, json) {
            if(err) return res.redirect(loginUrl);

            models.Vip.findById(json.userId).exec().then(function(user) {
                if(!user) {
                    return res.redirect(loginUrl);
                }

                req.session.user = user;

                next();
            });
        });
    };
};