/**
 * Created by anthony on 10/22/16.
 */

// Initialize collapse button
$(".button-collapse").sideNav();


//Twilio Client Voice App

$(function () {
    log('Requesting Capability Token...');
    $.getJSON('/token')
        .done(function (data) {
            // log('Got a token.');
            log('Token: ' + data.token);

            // Setup Twilio.Device
            Twilio.Device.setup(data.token);

            Twilio.Device.ready(function (device) {
                log('Twilio.Device Ready!');
                document.getElementById('call-controls').style.display = 'block';
            });

            Twilio.Device.error(function (error) {
                log('Twilio.Device Error: ' + error.message);
            });

            Twilio.Device.connect(function (conn) {
                log('Successfully established call!');
                document.getElementById('button-call').style.display = 'none';
                document.getElementById('button-hangup').style.display = 'block';
            });

            Twilio.Device.disconnect(function (conn) {
                log('Call ended.');
                document.getElementById('button-call').style.display = 'block';
                document.getElementById('button-hangup').style.display = 'none';
            });

            Twilio.Device.incoming(function (conn) {
                log('Incoming connection from ' + conn.parameters.From);
                var archEnemyPhoneNumber = '+12099517118';

                if (conn.parameters.From === archEnemyPhoneNumber) {
                    conn.reject();
                    log('It\'s your nemesis. Rejected call.');
                } else {
                    // accept the incoming connection and start two-way audio
                    conn.accept();
                }
            });

            setClientNameUI(data.identity);
        })
        .fail(function () {
            log('Could not get a token from server!');
        });

    // Bind button to make call

    $(document).on('click', '.click-to-call-iq', function () {
        // get the phone number to connect the call to
        var whoToCall = $(this).attr("data-call");

        var params = {
            To: whoToCall
        };

        log('Calling ' + params.To + '...');
        Twilio.Device.connect(params);
    });

    // Bind button to hangup call
    document.getElementById('button-hangup').onclick = function () {
        log('Hanging up...');
        Twilio.Device.disconnectAll();
    };

});

// Activity log
function log(message) {
    // var logDiv = document.getElementById('log');
    // logDiv.innerHTML += '<p>&gt;&nbsp;' + message + '</p>';
    // logDiv.scrollTop = logDiv.scrollHeight;

    Materialize.toast(message, 4000);
}

// Set the client name in the UI
function setClientNameUI(clientName) {
    var div = document.getElementById('client-name');
    div.innerHTML = 'Your client name: <strong>' + clientName +
        '</strong>';
}


// Adds a source element, and appends it to the audio element, represented
// by elem.
function addSource(elem, path) {
    $('<source />').attr('src', path).appendTo(elem);
}

function soundEffect(filename,id) {
    // use jQuery to insert an HTML5 audio element into the DOM
    var player = $('<audio />', {
        autoPlay : 'autoplay'
    });
    player.attr('id', id);

    addSource(player, filename);
    $(player).appendTo("body");
    document.getElementById(id).addEventListener('ended', function () {
        // alert('done!');
        var buttonIQ = $("a[data-id='" + id +"']");
        buttonIQ.html('<i class="material-icons circle light-blue darken-4">play_arrow</i>');
        buttonIQ.addClass('replayme');
        buttonIQ.removeClass('pauseme');

    });
}



function playAudio(id) {

    var x = document.getElementById(id);

    x.play();
}

function pauseAudio(id) {

    var x = document.getElementById(id);

    x.pause();
}

$(document).on('click', '.replayme', function () {

    event.preventDefault();

    // var mp3 = $(this).attr("href");

    var callID = $(this).attr("data-id");

    $(this).html('<i class="material-icons circle light-blue darken-3">pause</i>');
    $(this).addClass('pauseme');
    $(this).removeClass('replayme');
    // pause
    // console.log(mp3);
    playAudio(callID);

});


$(document).on('click', '.playme', function () {

    event.preventDefault();

    var mp3 = $(this).attr("href");

    var callID = $(this).attr("data-id");

    $(this).html('<i class="material-icons circle light-blue darken-3">pause</i>');
    $(this).addClass('pauseme');
    $(this).removeClass('playme');
    // pause
    // console.log(mp3);
    soundEffect(mp3,callID);

});


$(document).on('click', '.pauseme', function () {

    event.preventDefault();

    // var mp3 = $(this).attr("href");
    var callID = $(this).attr("data-id");

    $(this).html('<i class="material-icons circle light-blue darken-4">play_arrow</i>');
    $(this).addClass('replayme');
    $(this).removeClass('pauseme');
    // pause
    // console.log(mp3);
    // soundEffect(mp3);
    pauseAudio(callID);

});

$(document).on('click', '.showlist', function () {

$.get( "../allrecordings", function( data ) {
    // $( ".result" ).html( data );
    // alert( "Load was performed." );
    console.log(data);
});

});