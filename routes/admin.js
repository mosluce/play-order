var express = require('express');
var router = express.Router();
var pipe = require('../pipe');
var admin = pipe.admin('/admin/login');
var path = require('path');
var fs = require('fs');
var multer = require('multer');
var upload = multer({
    dest: path.join(__dirname, '..', 'temp')
});

var photoDir = path.join(__dirname, '..', 'public', 'photo');

if(!fs.existsSync(photoDir)) {
    fs.mkdirSync(photoDir);
}

router.get('/', admin, function (req, res, next) {
    res.render('admin/index', {
        title: 'Order::Admin'
    });
});

router.get('/item', admin, function (req, res, next) {
    models.Item.find().exec().then(function(items) {
        res.render('admin/item', {
            title: 'Order::Admin::Item',
            items: items || []
        });
    });
});

router.post('/item', admin, upload.single('photo'), function (req, res, next) {
    var file = req.file;
    var data = req.body;

    data.price = {
        small: data.priceSmall,
        big: data.priceBig
    };

    var pattern = /image\/.+/;

    if(!pattern.test(file.mimetype)) {
        return res.render('admin/item', {
            title: 'Order::Admin::Item',
            error: {
                message: 'mimetype is not allow'
            }
        });
    }

    models.Item.create(data).then(function(item) {
        fs.rename(file.path, path.join(photoDir, item.id), function(err) {
            if(err) return next(err);

            res.redirect('/admin/item');
        });
    });
});

router.get('/order', admin, function (req, res, next) {
    res.render('admin/order', {
        title: 'Order::Admin::Order Log'
    });
});

router.get('/stock', admin, function (req, res, next) {
    res.render('admin/stock', {
        title: 'Order::Admin::Stock'
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

        return res.redirect('/admin/item');
    }).catch(function (err) {
        next(err);
    });
});

module.exports = router;