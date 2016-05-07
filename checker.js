var db = require('./libs/db');
var Promise = require('bluebird');
var path = require('path');

function looper(models) {
    console.log('looper', new Date());

    var before30 = new Date(new Date() - 30 * 60 * 1000);
    var before5 = new Date(new Date() - 5 * 60 * 1000);

    var Order = models.Order;
    var Item = models.Item;

    Order.find({
        $and: [{
            $or: [{
                datetime: {
                    $lt: before30,
                    $ne: null
                },
                createdAt: {
                    $lt: before5
                }
            }]
        }, {}]
    }).exec().then(function (orders) {
        Promise.map(orders, function (o) {
            return Promise.map(o.list, function (l) {
                return Item.findById(l.item).exec().then(function (item) {
                    item.amount.big += l.amount.big;
                    item.amount.small += l.amount.small;
                    return item.save();
                });
            }).then(function () {
                o.canceled = true;
                return o.save();
            });
        }).then(function () {
            setTimeout(function () {
                looper(models);
            }, 3 * 1000);
        }).catch(console.log);
    }, console.log);
}

db.setup('mongodb://play:play12345@ds043262.mlab.com:43262/play-restaurant', path.join(__dirname, 'models'), function (error, connection) {
    if (error) return console.log(error);

    looper(connection.models);
});