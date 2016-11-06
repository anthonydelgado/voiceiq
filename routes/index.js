require('dotenv').load();
var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var CallRecord = require('../models/callrecords');

var gravatar = require('gravatar');

var accountSid = 'AC920c9920faf15270c5394f690187585b';
var authToken = "2a97b37e4a7cdd9bbd18b5b64cca1369";
var twimlAppSID = 'AP453137dfea43ec9d76b2b038f872c08f';
var client = require('twilio')(accountSid, authToken);
var twilio = require('twilio');
var router = express.Router();


var capability = new twilio.Capability(accountSid, authToken);



/* GET home page. */

router.get('/', function (req, res) {
    if(req.user){
        capability.allowClientIncoming(req.user.username);
        var token = capability.generate();
        var gravatarImage = gravatar.url(req.user.username, {s: '200', r: 'pg', d: 'retro'});
    }else{
        var gravatarImage = gravatar.url('emerleite@gmail.com', {s: '200', r: 'pg', d: 'retro'});
        var token = '';
    }
    res.render('index', { user : req.user, grav : gravatarImage, twiliotoken: token });
});

var google_speech = require('google-speech');




router.get('/google', function (req, res) {
    google_speech.ASR({
            developer_key: 'AIzaSyCEZeOoM6VexRkeOHnlCPYbGTp0Sr4qGCM',
            file: 'https://raw.githubusercontent.com/tksalesforce/static_assets/master/mission_bicycle/mission_bicycle_neutral.mp3',
        }, function(err, httpResponse, xml){
            if(err){
                res.json(err);
            }else{
                res.json(httpResponse)
            }
        }
    );
});

/*
 Generate a Capability Token for a Twilio Client user - it generates a random
 username for the client requesting a token.
 */
router.get('/token', function(req, res) {

    if(req.user){

        var identity = req.user.username;

        var capability = new twilio.Capability(accountSid, authToken);
        capability.allowClientOutgoing(twimlAppSID);
        capability.allowClientIncoming(identity);
        var token = capability.generate();

        // Include identity and token in a JSON response
        res.send({
            identity: identity,
            token: token
        });

    }else{
        res.send({
            identity: '',
            token: ''
        });
    }

});

router.get('/recordings', function (req, res) {
    client.recordings.list(function(err, data) {
        res.json(data.recordings);
    });
});



router.get('/callrecordings', function (req, res) {


    client.recordings.list(function(err, data) {
            data.recordings.forEach(function(recording) {
                 
                client.calls(recording.call_sid).get(function(err, data) {

                    var addCall = new CallRecord(data);

                    // res.json(data);
                });
                
            });
    });

});


router.post('/incoming', function (req, res) {


    // Create TwiML response
    var twiml = new twilio.TwimlResponse();

    if(req.body.To) {
        twiml.dial({ callerId: 'client:tommy'}, function() {
            // wrap the phone number or client name in the appropriate TwiML verb
            // by checking if the number given has only digits and format symbols
            if (/^[\d\+\-\(\) ]+$/.test(req.body.To)) {
                this.number(req.body.To);
            } else {
                this.client(req.body.To);
            }
        });
    } else {
        twiml.say("Thanks for calling!");
    }

    res.set('Content-Type', 'text/xml');
    res.send(twiml.toString());
        //
        // var twiml = new twilio.TwimlResponse();
        //
        // twiml.say('Hi!  Thanks for checking out my app!')
        //     .play('http://myserver.com/mysong.mp3');
        //
        // res.type('text/xml');
        // res.send(twiml.toString());


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
