var express = require('express');
var router = express.Router();

router.get('/login', function (req, res, next) {
    res.render('user/login', {
        title: 'Restaurant::Login'
    });
});

router.post('/login', function (req, res, next) {
    var data = req.body;
    var phone = data.phone;
    var password = data.password;

    models.vip.findOne({
        phone: phone
    }).exec().then(function(user) {
        if(!user) {
            return res.render('user/login', {
                title: 'Restaurant::Login',
                error: {
                    message: 'VIP is not exists'
                }
            });
        }

        if(user.password !== password) {
            return res.render('user/login', {
                title: 'Restaurant::Login',
                error: {
                    message: 'Password is invalid'
                }
            });
        }

        req.session.user = user;

        res.redirect('/');
    });
});

router.get('/register', function (req, res, next) {
    res.render('user/register', {
        title: 'Restaurant::Register'
    });
});

router.post('/register', function (req, res, next) {
    var data = req.body;
    var phone = data.phone;
    var password = data.password;
    var displayName = data.displayName;

    if (!phone || !password || !displayName) {
        return res.render('user/register', {
            title: 'Restaurant::Register',
            error: {
                message: 'All Fields must be filled'
            }
        });
    }

    models.vip.findOne({
        phone: phone
    }).exec().then(function (user) {
        if (user) {
            return res.render('user/register', {
                title: 'Restaurant::Register',
                error: {
                    message: 'Phone is exists'
                }
            });
        }

        models.vip.create({
            phone: phone,
            password: password,
            displayName: displayName
        }).then(function() {
            return res.redirect('/user/login');
        });
    })
});

module.exports = router;