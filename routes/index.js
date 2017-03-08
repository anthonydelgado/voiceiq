require('dotenv').load();
var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var Question = require('../models/questions');
var CallRecord = require('../models/callrecords');
var Transcription = require('../models/transcription');

var bodyParser = require('body-parser');
var gravatar = require('gravatar');

var accountSid = 'AC920c9920faf15270c5394f690187585b';
var authToken = "2a97b37e4a7cdd9bbd18b5b64cca1369";
var twimlAppSID = 'AP453137dfea43ec9d76b2b038f872c08f';
// https://www.twilio.com/console/phone-numbers/dev-tools/twiml-apps
var client = require('twilio')(accountSid, authToken);
var twilio = require('twilio');
var AccessToken = require('twilio').AccessToken;
var VideoGrant = AccessToken.VideoGrant;


var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');

var router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

var capability = new twilio.Capability(accountSid, authToken);

/* GET home page. */

router.get('/', function (req, res) {


    var query = Transcription.find().limit(10).sort([['_id', 'descending']]).exec(function () {

        // res.json(JSON.stringify(query));
        // res.send(query.emitted.fulfill[0]);
        var qList = query.emitted.fulfill[0];




        if(req.user){

            var gravatarImage = gravatar.url(req.user.username, {s: '200', r: 'pg', d: 'retro'});

            res.render('index', { user : req.user, grav : gravatarImage, list: qList });

        }else{
            res.render('index', { user : req.user, list: qList });
        }


    });


});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

// Call Page
router.get('/call/:sid', function (req, res) {


    var personality_insights = new PersonalityInsightsV3({
        "password": "5LeYlPklm5Xb",
        "username": "dbe195f8-a580-43c2-863d-c9c9b327c9e4",
        version_date: '2016-10-19'
    });

    /* personality insights credentials and API
     {
     "url": "https://gateway.watsonplatform.net/personality-insights/api",

     }
     */
    module.exports = personality_insights;



    // find each Transcription with a CallSid matching url
    var query = Transcription.findOne({ 'CallSid': req.params.sid }).exec(function () {

        var calldata = query.emitted.fulfill[0];

        personality_insights.profile({

                text: calldata.TranscriptionText + " " + calldata.TranscriptionText + " " + calldata.TranscriptionText + " " + calldata.TranscriptionText + " " + calldata.TranscriptionText + " " + calldata.TranscriptionText + " " + calldata.TranscriptionText + " " + calldata.TranscriptionText,

                consumption_preferences: true
            },
            function (err, response) {
                if (err)
                    console.log('error:', err);
                //   res.json(err);
                else
                    console.log('cool');
                //   res.json(response.consumption_preferences);



                // var gravatarImage = gravatar.url(req.user.username, {s: '200', r: 'pg', d: 'retro'});

                if(req.user){

                    var gravatarImage = gravatar.url(req.user.username, {s: '200', r: 'pg', d: 'retro'});

                    res.render('call', { user : req.user, grav : gravatarImage, call: calldata, ibm: response.consumption_preferences });

                }else{
                    res.render('call', { user : req.user, call: calldata, ibm: response.consumption_preferences });

                }



            });


    });

});


router.get('/tag/:search', function (req, res) {


    var query = Transcription.find({TranscriptionText : req.params.search}).limit(10).sort([['_id', 'descending']]).exec(function () {

        // res.json(JSON.stringify(query));
        // res.send(query.emitted.fulfill[0]);
        var qList = query.emitted.fulfill[0];

        if(req.user){

            var gravatarImage = gravatar.url(req.user.username, {s: '200', r: 'pg', d: 'retro'});

            res.render('index', { user : req.user, grav : gravatarImage, list: qList });

        }else{
            res.render('index', { user : req.user, list: qList });
        }


    });


});

/*
 Generate a Capability Token for a Twilio Client user - it generates a random
 username for the client requesting a token.
 */


router.get('/token', function(req, res) {

    if(req.user) {

        var identity = req.user.id;

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

        // Include identity and token in a JSON response
        res.send({
            identity: '',
            token: ''
        });

    }

});


// Video Token

router.get('/videotoken', function(request, response) {
    var identity = request.user.username;
    //
    // TWILIO_ACCOUNT_SID=ACbda9e5f778d4e4c3eea4c2d7ecc4b2ac
    // TWILIO_API_KEY=SK2745be1461dea7b1e7c5fbe402f8c9a7
    // TWILIO_API_SECRET=6sTJp49PY3udRBGfIXnlqmOyzWeDGove
    // TWILIO_CONFIGURATION_SID=VS463af735610bfaa0aa78d3cd52640e15

    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
    var token = new AccessToken(
        'ACbda9e5f778d4e4c3eea4c2d7ecc4b2ac',
        'SK2745be1461dea7b1e7c5fbe402f8c9a7',
        '6sTJp49PY3udRBGfIXnlqmOyzWeDGove'
    );

    // Assign the generated identity to the token
    token.identity = identity;

    //grant the access token Twilio Video capabilities
    var grant = new VideoGrant();
    grant.configurationProfileSid = 'VS463af735610bfaa0aa78d3cd52640e15';
    token.addGrant(grant);

    // Serialize the token to a JWT string and include it in a JSON response
    response.send({
        identity: identity,
        token: token.toJwt()
    });
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

router.post('/sms', function (req, res) {

    if(req.body.To) {
        client.sendMessage({
            to: req.body.To,
            from: '+19732334421',
            body: req.body.text
        });
    }
    res.send('Your message has been sent!');
});

router.post('/incoming', function (req, res) {


    // Create TwiML response
    var twiml = new twilio.TwimlResponse();

    if(req.body.To) {
        twiml.dial({ callerId: '+19732334421'}, function() {
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

});



router.post('/incomingcall', function (req, res) {


    // Create TwiML response
    var twiml = new twilio.TwimlResponse();

    twiml.say("Thanks for calling!")
        .say('Welcome To Newarks Safe Sorority. Where every woman has a voice. State your concern after the tone and we  will anonymously route your request to a safe sister', {
            voice:'woman',
            language:'en-gb'
        })
        .record({
            maxLength:120,
            playBeep: true,
            transcribe: true,
            transcribeCallback:'/saverecording'
        });


    res.set('Content-Type', 'text/xml');
    res.send(twiml.toString());

});

router.get('/allrecordings', function (req, res) {

    var query = Transcription.find().limit(10).exec(function () {

        // res.json(JSON.stringify(query));
        res.send(query.emitted.fulfill[0]);
    });

});

router.post('/saverecording', function(req, res) {

        var userTranscription = new Transcription({
            TranscriptionSid: req.body.TranscriptionSid,
            TranscriptionText:   req.body.TranscriptionText,
            TranscriptionStatus:   req.body.TranscriptionStatus,
            TranscriptionUrl:   req.body.TranscriptionUrl,
            RecordingSid:   req.body.RecordingSid,
            RecordingUrl:   req.body.RecordingUrl,
            CallSid:   req.body.CallSid,
            AccountSid:   req.body.AccountSid,
            From:   req.body.From,
            To:   req.body.To,
            CallStatus:   req.body.CallStatus,
            ApiVersion:   req.body.ApiVersion,
            Direction:   req.body.Direction
        });

        userTranscription.save(function (err, data) {
            if (err) res.sendStatus(500);
            else res.sendStatus(200);
        });

});


router.get('/add', function(req, res) {
    res.render('add', { });
    // Quentions
});



router.post('/add', function(req, res) {

    if(req.user){
        var userQuestion = new Question({
            body : req.body.question,
            author : req.user.username,
            comments : [],
            hidden: false,
            meta: {
                votes: 0,
                favs:  0
            }
        });

        userQuestion.save(function (err, data) {
            if (err) res.send(err);
            else res.send('Your question has been saved!');

        });
    }else{
        res.send('You must be logged in to ask a question.');
    }

});

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.get('/videochat', function(req, res) {

    if(req.user){

        var gravatarImage = gravatar.url(req.user.username, {s: '200', r: 'pg', d: 'retro'});

        res.render('videochat', { user : req.user, grav : gravatarImage });

    }else{
        res.render('videochat', { user : req.user });
    }

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
