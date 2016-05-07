var express = require('express');
var router = express.Router();
var moment = require('moment');
var pipe = require('../pipe');
var auth = pipe.auth('/user/login');

router.use('/', auth);

router.get('/', function (req, res, next) {
    var qd = new Date(req.session.queryDate);
    var start, end;

    if(!req.session.queryDate) {
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
        vip: req.session.user,
        datetime: {
            $gte: start,
            $lte: end
        }
    }).populate('list.item').exec().then(function (orders) {
        res.render('query', {
            title: 'Query',
            orders: orders,
            selectedDate: moment(qd).format('YYYY/MM/DD'),
            moment: moment
        });
    }).catch(next);
});

router.post('/', function (req, res, next) {
    req.session.queryDate = moment(req.body.queryDate, 'YYYY/MM/DD')._d;
    res.redirect('/query');
});

router.post('/delete/:id', function (req, res, next) {
    var id = req.params.id;

    models.Order.findById(id).exec().then(function (order) {
        if(new Date() > order.datetime) {
            res.redirect('/query');
        } else {
            order.remove().then(function () {
                res.redirect('/query');
            });
        }
    }).catch(next);
});

module.exports = router;