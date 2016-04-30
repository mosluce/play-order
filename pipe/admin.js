module.exports = function(loginUrl) {
    return function (req, res, next) {
        if(!req.session.admin) return res.redirect(loginUrl);

        next();
    };
};