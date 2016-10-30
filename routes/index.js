
require('dotenv').load();


var express = require('express');
var passport = require('passport');
var Account = require('../models/account');


var accountSid = 'AC920c9920faf15270c5394f690187585b';
var authToken = "2a97b37e4a7cdd9bbd18b5b64cca1369";
var client = require('twilio')(accountSid, authToken);

var router = express.Router();

/* GET home page. */

router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});



router.get('/recordings', function (req, res) {
    client.recordings.list(function(err, data) {
        res.json(data);
    });
});


router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username , mentor : req.body.mentor , student : req.body.student }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { account : account });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});


module.exports = router;
