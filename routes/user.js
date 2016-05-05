var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config');

router.get('/login', function (req, res, next) {
    res.render('user/login', {
        title: 'Restaurant::Login'
    });
});

router.post('/login', function (req, res, next) {
    var data = req.body;
    var phone = data.phone;
    var password = data.password;

    models.Vip.findOne({
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
        res.cookie('token', jwt.sign({userId: user.id}, config.secret), {
            expires: new Date(Date.now() + 60*60*1000)
        });

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

    models.Vip.findOne({
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

        models.Vip.create({
            phone: phone,
            password: password,
            displayName: displayName
        }).then(function() {
            return res.redirect('/user/login');
        });
    })
});

module.exports = router;