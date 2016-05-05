/**
 * Created by mosluce on 2016/5/2.
 */
var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var multer = require('multer');
var upload = multer({
    dest: path.join(__dirname, '..', '..', 'temp')
});

var photoDir = path.join(__dirname, '..', '..', 'public', 'photo');

if(!fs.existsSync(photoDir)) {
    fs.mkdirSync(photoDir);
}

var routeRoot = '/admin/item';

function checkFiletype(file) {

    var pattern = /image\/.+/;

    return pattern.test(file.mimetype);
}

router.get('/', function (req, res, next) {
    models.Item.find().exec().then(function(items) {
        res.render('admin/item', {
            title: 'Order::Admin::Item',
            items: items || [],
            error: req.flash('error') || undefined
        });
    });
});

router.post('/', upload.single('photo'), function (req, res, next) {
    var file = req.file;
    var data = req.body;

    data.price = {
        small: data.priceSmall,
        big: data.priceBig
    };

    if(file && !checkFiletype(file)) {
        return res.error('mimetype is not allow', routeRoot);
    }

    models.Item.create(data).then(function(item) {
        if(!file) {
            return res.redirect(routeRoot);
        }

        fs.rename(file.path, path.join(photoDir, file.filename), function(err) {
            if(err) return next(err);

            item.photo = file.filename;
            item.save().then(function() {
                res.redirect(routeRoot);
            });
        });
    });
});

//update
router.post('/update/:id', upload.single('photo'), function (req, res, next) {
    var id = req.params.id;

    var file = req.file;
    var data = req.body;

    data.price = {
        small: data.priceSmall,
        big: data.priceBig
    };

    if(file && !checkFiletype(file)) {
        return res.error('mimetype is not allow', routeRoot);
    }
    
    models.Item.findById(id).exec().then(function(item) {
        item = _.extend(item, data);
        return item.save();
    }).then(function(item) {
        if(!file) {
            return res.redirect(routeRoot);
        }

        fs.rename(file.path, path.join(photoDir, file.filename), function(err) {
            if(err) return next(err);

            item.photo = file.filename;
            item.save().then(function() {
                res.redirect(routeRoot);
            });
        });
    }).catch(next);
});

//delete
router.post('/delete/:id', function (req, res, next) {
    var id = req.params.id;

    models.Item.findById(id).exec().then(function(item) {
        return item.remove();
    }).then(function() {
        res.redirect(routeRoot);
    }).catch(next);
});

module.exports = router;