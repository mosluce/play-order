const express = require('express');
const router = express.Router();
const pipe = require('../pipe');
const admin = pipe.admin('/admin/login');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const upload = multer({
    dest: path.join(__dirname, '../tmp')
});

const photodir = path.join(__dirname, '../public/photo');
const itemRouter = '/admin/item';

if (!fs.existsSync(photodir)) {
    fs.mkdirSync(photodir);
}

router.use('/', function (req, res, next) {
    req.app.locals.title = 'Admin Console';
    req.app.locals.error = req.flash('error')[0] || undefined;

    next();
});

router.get('/login', function (req, res, next) {
    res.render('admin/login');
});

router.post('/login', function (req, res, next) {
    const Admin = models.Admin;

    let account = req.body.account;
    let password = req.body.password;

    Admin.count().exec().then((count) => {
        if (count === 0) {
            return Admin.create({
                account,
                password
            });
        }

        return Admin.findOne({
            account,
            password
        }).exec();
    }).then((admin) => {
        if (!admin) {
            req.flash('error', {
                message: 'Login failed'
            });

            return res.redirect('/admin/login');
        }

        req.session.admin = admin;
        res.redirect('/admin');
    });
});

router.get('/', admin, function (req, res, next) {
    res.render('admin/index');
});

router.get('/item', admin, (req, res, next) => {
    const Item = models.Item;

    Item.find().exec().then((items) => {
        res.render('admin/item', {
            items
        });
    });
});

router.post('/item', admin, upload.single('photo'), (req, res, next) => {
    const Item = models.Item;

    let file = req.file;
    let data = {
        name: req.body.name,
        price: {
            big: req.body.priceBig,
            small: req.body.priceSmall
        }
    };

    let mimetype = file.mimetype;
    let patten = /^image\/.+$/;

    if (!patten.test(mimetype)) {
        req.flash('error', {
            message: 'file type not allow'
        });
        return res.redirect(itemRouter);
    }

    Item.create(data).then((item) => {
        const itemId = item.id;
        const targetPath = path.join(photodir, itemId);
        const sourcePath = file.path;

        fs.rename(sourcePath, targetPath, (err) => {
            if (err) return next(err);

            return res.redirect(itemRouter);
        });
    });
});

router.post('/item/update/:id', admin, upload.single('photo'), (req, res, next) => {
    const Item = models.Item;

    let file = req.file;
    let data = {
        name: req.body.name,
        price: {
            big: req.body.priceBig,
            small: req.body.priceSmall
        }
    };

    if (file) {
        let mimetype = file.mimetype;
        let patten = /^image\/.+$/;

        if (!patten.test(mimetype)) {
            req.flash('error', {
                message: 'file type not allow'
            });
            return res.redirect(itemRouter);
        }
    }

    Item.findById(req.params.id).exec().then((item)=> {
        item.name = data.name;
        item.price = data.price;

        if(!file) {
            return item.save().then(() => {
                res.redirect(itemRouter);
            });
        } else {
            const itemId = item.id;
            const targetPath = path.join(photodir, itemId);
            const sourcePath = file.path;

            return fs.rename(sourcePath, targetPath, (err) => {
                if (err) return next(err);

                item.save().then(() => {
                    res.redirect(itemRouter);
                });
            });
        }
    });
});

router.post('/item/remove/:id', admin, (req, res, next) => {
    const Item = models.Item;

    Item.findById(req.params.id).exec().then((item) => {
        item.remove().then(() => {
            res.redirect(itemRouter);
        });
    });
});

router.get('/stock', admin, (req, res, next) => {
    res.render('admin/stock');
});

router.get('/stock/update/:id', admin, (req, res, next) => {

});

module.exports = router;