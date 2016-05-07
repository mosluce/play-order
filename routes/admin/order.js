var express = require('express');
var router = express.Router();
var moment = require('moment');
var Promise = require('bluebird');

router.get('/', function (req, res, next) {
    var qd = new Date(req.session.queryDate);
    var start, end;

    if (!req.session.queryDate) {
        qd = new Date();
    }

    start = new Date(qd);
    end = new Date(qd);

    start.setHours(0);
    start.setMinutes(0);
    start.setSeconds(0);
    end.setHours(23);
    end.setMinutes(59);
    end.setSeconds(59);

    models.Order.find({
        datetime: {
            $gte: start,
            $lte: end
        }
    }).populate('list.item vip').exec().then(function (orders) {
        res.render('admin/order', {
            title: 'Order::Admin::Order Log',
            orders: orders,
            selectedDate: moment(qd).format('YYYY/MM/DD'),
            moment: moment
        });
    }).catch(next);
});

router.post('/', function (req, res, next) {
    req.session.queryDate = moment(req.body.queryDate, 'YYYY/MM/DD')._d;
    res.redirect('/admin/order');
});

router.post('/update/:id', function (req, res, next) {
    var id = req.params.id;
    var action = req.body.action;

    models.Order.findById(id).populate('list.item vip').exec().then(function (order) {
        var tasks = [];

        if (action === 'finish') {
            order.finished = true;

            var histories = [];
            order.list.forEach(function (l, i) {
                if (l.amount.big !== 0) {
                    histories.push({
                        item: l.item.name + '(Big)',
                        vip: order.vip.displayName,
                        amount: l.amount.big
                    });
                }

                if (l.amount.small !== 0) {
                    histories.push({
                        item: l.item.name + '(Small)',
                        vip: order.vip.displayName,
                        amount: l.amount.small
                    });
                }
            });

            tasks.push(models.History.create(histories));
        } else {
            order.canceled = true;

            tasks.push(Promise.map(order.list, function (l) {
                return models.Item.findById(l.item).exec()
                    .then(function (item) {
                        item.amount.big += l.amount.big;
                        item.amount.small += l.amount.small;

                        return item.save();
                    });
            }));
        }

        tasks.push(order.save());

        Promise.all(tasks).then(function() {
            res.redirect('/admin/order');
        });

    }).catch(next);
});

module.exports = router;