var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if(req.session.user) req.app.locals.user = req.session.user;
    next();
}, function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.use('/order', require('./order'));
router.use('/admin', require('./admin'));
router.use('/user', require('./user'));

module.exports = router;
