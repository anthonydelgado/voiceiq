/**
 * Created by user on 11/6/16.
 */


$(document).ready(function () {
//Twilio Client Voice App

$(function () {
    log('Requesting Capability Token...');
    $.getJSON('/token')
        .done(function (data) {
            log('You are online.');
            console.log('Token: ' + data.token);

            // Setup Twilio.Device
            Twilio.Device.setup(data.token);

            Twilio.Device.ready(function (device) {
                log('Twilio.Device Ready!');
                $('#call-controls').style.display = 'block';
            });

            Twilio.Device.error(function (error) {
                log('Twilio.Device Error: ' + error.message);
            });

            Twilio.Device.connect(function (conn) {
                log('Successfully established call!');
                $('#button-call').style.display = 'none';
                $('#button-hangup').style.display = 'block';
            });

            Twilio.Device.disconnect(function (conn) {
                log('Call ended.');
                $('#button-call').style.display = 'block';
                $('#button-hangup').style.display = 'none';
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
    $('#button-hangup').onclick = function () {
        log('Hanging up...');
        Twilio.Device.disconnectAll();
    };

});

// Activity log
function log(message) {
    // var logDiv = $('#log');
    // logDiv.innerHTML += '<p>&gt;&nbsp;' + message + '</p>';
    // logDiv.scrollTop = logDiv.scrollHeight;

    Materialize.toast(message, 4000);
}

// Set the client name in the UI
function setClientNameUI(clientName) {
    // var div = $('#client-name');
    // div.innerHTML = 'Your client name: <strong>' + clientName +
    //     '</strong>';
}


//end doc ready
});