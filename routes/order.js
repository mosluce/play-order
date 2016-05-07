var express = require('express');
var router = express.Router();
var pipe = require('../pipe');
var auth = pipe.auth('/user/login');
var Promise = require('bluebird')

router.use('/', auth);

router.get('/', function (req, res, next) {
    var Item = models.Item;

    Item.find().exec().then(function (items) {
        res.render('order', {
            title: 'Order',
            items: items
        });
    });
});

router.post('/', function (req, res, next) {
    var Item = models.Item;
    var Order = models.Order;

    var data = req.body;
    var orders = [];

    for (var i = 0; i < data.id.length; i++) {
        var o = {
            amountSmall: parseInt(data.amountSmall[i]),
            amountBig: parseInt(data.amountBig[i]),
            id: data.id[i],
            name: data.name[i]
        };

        if (o.amountBig || o.amountSmall) {
            orders.push(o);
        }
    }

    //檢查
    Promise.map(orders, function (o) {
        return new Promise(function (resolve, reject) {

            Item.findById(o.id).exec().then(function (item) {
                if (o.amountBig > item.amount.big || o.amountSmall > item.amount.small) {
                    return reject({
                        message: o.name + ' order amount is larger than retain'
                    });
                }

                resolve(item);
            });
        });
    }).then(function (items) {
        //扣除
        items.forEach(function (item, index) {
            item.amount.big -= orders[index].amountBig;
            item.amount.small -= orders[index].amountSmall;
        });

        return Promise.map(items, function(item) {
            return item.save();
        });
    }).then(function (items) {
        //建立訂單
        var list = [];

        for (var i in items) {
            var o = orders[i];
            var item = items[i];

            list.push({
                item: item,
                amount: {
                    big: o.amountBig,
                    small: o.amountSmall
                }
            });
        }

        Order.create({
            list: list,
            vip: req.user
        }).then(function (order) {
            req.session.order = order;
            res.redirect('/order/confirm');
        });
    }).catch(function(err) {
        res.error(err.message, '/order');
    });
});

router.get('/confirm', function (req, res, next) {
    var order = req.session.order;

    if(!order) {
        return res.redirect('/order');
    }

    res.render('confirm', {
        title: 'Confirm',
        order: order
    });
});

module.exports = router;