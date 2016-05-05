var express = require('express');
var router = express.Router();
var pipe = require('../../pipe');
var admin = pipe.admin('/admin/login');
var jwt = require('jsonwebtoken');
var config = require('../../config');

router.use('/item', admin, require('./item'));
router.use('/stock', admin, require('./stock'));

router.get('/', admin, function (req, res, next) {
    res.render('admin/index', {
        title: 'Order::Admin'
    });
});

router.get('/order', admin, function (req, res, next) {
    res.render('admin/order', {
        title: 'Order::Admin::Order Log'
    });
});

router.get('/report', admin, function (req, res, next) {
    res.render('admin/report', {
        title: 'Order::Admin::Report'
    });
});

router.get('/login', function (req, res, next) {
    res.render('admin/login', {
        title: 'Order::Admin Login'
    });
});

router.post('/login', function (req, res, next) {
    var data = req.body;
    var account = data.account;
    var password = data.password;

    models.Admin.count().exec().then(function (count) {
        if (count === 0) {
            return models.Admin.create({
                account: account,
                password: password,
                root: true
            });
        }

        return models.Admin.findOne({
            account: account,
            password: password
        }).exec();
    }).then(function(admin) {
        if(!admin) {
            return res.render('admin/login', {
                title: 'Order::Admin Login',
                error: {
                    message: '登入失敗'
                }
            });
        }

        req.session.admin = admin;
        res.cookie('token', jwt.sign({adminId: admin.id}, config.secret), {
            expires: new Date(Date.now() + 60*60*1000)
        });

        return res.redirect('/admin/item');
    }).catch(function (err) {
        next(err);
    });
});

module.exports = router;