var express = require('express');
var router = express.Router();
var _ = require('underscore');

var routeRoot = '/admin/stock';

router.get('/', function (req, res, next) {
    models.Item.find().exec().then(function(items) {

        res.render('admin/stock', {
            title: 'Order::Admin::Stock',
            items: items || [],
            error: req.flash('error') || undefined
        });
    }).catch(next);
});

router.post('/:id', function (req, res, next) {
    var id = req.params.id;
    var data = req.body;

    data.amount = {
        big: data.amountBig,
        small: data.amountSmall
    };

    models.Item.findById(id).exec().then(function(item) {
        if(!item) {
            req.flash('error', {
                message: '指定的物件不存在'
            });
            return res.redirect('/admin/stock');
        }

        return item.update({
            $set: data
        });
    }).then(function() {
        res.redirect(routeRoot);
    }).catch(next);
});

module.exports = router;