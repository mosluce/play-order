var express = require('express');
var router = express.Router();
var pipe = require('../../pipe');
var admin = pipe.admin('/admin/login');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var Promise = require('bluebird');

router.use('/item', admin, require('./item'));
router.use('/stock', admin, require('./stock'));
router.use('/order', admin, require('./order'));

router.get('/', admin, function (req, res, next) {
    res.render('admin/index', {
        title: 'Order::Admin'
    });
});

router.get('/report', admin, function (req, res, next) {
    res.render('admin/report', {
        title: 'Order::Admin::Report'
    });
});

router.get('/report/item', admin, function (req, res, next) {

    models.History.aggregate()
        .group({
            _id: {
                item: '$item'
            },
            sum: {
                $sum: '$amount'
            }
        })
        .sort('-sum')
        .limit(10)
        .exec()
        .then(function(result) {
            res.send(result);
            // res.render('admin/report', {
            //     title: 'Order::Admin::Report::Item'
            // });
        })
        .catch(next);
});


router.get('/report/person', admin, function (req, res, next) {
    var startDate = req.session.startDate;
    var endDate = req.session.endDate;

    if(!startDate) {
        startDate = new Date();
        startDate.setHours(0);
        startDate.setMinutes(0);
    }

    if(!endDate) {
        endDate = new Date();
        endDate.setHours(23);
        endDate.setMinutes(59);
    }

    models.Order.aggregate()
        .match({
            // datetime: {
            //     $lte: endDate,
            //     $gte: startDate
            // },
            finished: {
                $eq: true
            }
        })
        .group({
            _id: "$vip",
            sum: {
                $sum: 1
            },
            vip: {
                $first: '$vip'
            }
        })
        .sort('-sum')
        .limit(5)
        .exec()
        .then(function(orders) {
            Promise.map(orders, function (o) {
                return models.Vip.findById(o.vip).exec()
            }).then(function(users) {
                orders.forEach(function (o, index) {
                    o.vip = users[index];
                });

                res.render('admin/report-person', {
                    title: 'Order::Admin::Report::Person',
                    orders: orders
                });
            });
        })
        .catch(next);
});

router.post('/report/person', function (req, res, next) {
    req.session.startDate = moment(req.body.startDate, 'YYYY/MM/DD')._d;
    req.session.endDate = moment(req.body.endDate, 'YYYY/MM/DD')._d;
    res.redirect('/report/person');
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