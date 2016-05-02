module.exports = function(loginUrl) {
    return function (req, res, next) {
        if(!req.session.user) return res.redirect(loginUrl);

        req.app.locals.user = req.session.user;

        next();
    };
};