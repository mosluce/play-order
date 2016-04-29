var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.use('/order', require('./order'));
router.use('/user', require('./user'));

module.exports = router;
