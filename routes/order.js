var express = require('express');
var router = express.Router();
var pipe = require('../pipe');
var auth = pipe.auth('/user/login');

router.use('/', auth);

router.get('/', function (req, res, next) {
    res.render('order', {
        title: 'Order'
    });
});

module.exports = router;