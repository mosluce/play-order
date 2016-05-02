module.exports = function() {
    return function(req, res, next) {
        req.flash = function() {
            var args = arguments;

            req.session.flash = req.session.flash || {};

            if(args.length == 1) {
                //getter
                var cache = req.session.flash[args[0]];
                req.session.flash[args[0]] = null;
                return cache;
            } else {
                //setter
                req.session.flash[args[0]] = args[1];
            }
        };

        next();
    };
};