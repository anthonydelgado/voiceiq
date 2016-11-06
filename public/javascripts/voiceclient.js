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
            });

            Twilio.Device.error(function (error) {
                log('Twilio.Device Error: ' + error.message);
            });

            Twilio.Device.connect(function (conn) {
                log('Successfully established call!');
            });

            Twilio.Device.disconnect(function (conn) {
                log('Call ended.');
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

        event.preventDefault();

        Twilio.Device.disconnectAll();


        // get the phone number to connect the call to
        var whoToCall = $(this).attr("data-call");

        $(this).addClass('end-call-iq');
        $(this).addClass('red');

        $(this).removeClass('light-blue');
        $(this).removeClass('click-to-call-iq');

        $(this).html('<i class="material-icons left">call_end</i>End');

        var params = {
            To: whoToCall
        };

        log('Calling ' + params.To + '...');
        Twilio.Device.connect(params);
    });

    // Bind button to end call

    $(document).on('click', '.end-call-iq', function () {

        event.preventDefault();

        Twilio.Device.disconnectAll();

        log('Hanging up...');

        $(this).addClass('click-to-call-iq');

        $(this).removeClass('red');

        $(this).addClass('light-blue');

        $(this).html('<i class="material-icons left">perm_phone_msg</i>Call');
        $(this).removeClass('end-call-iq');

    });


});

// Activity log
function log(message) {
    Materialize.toast(message, 4000);
}

// Set the client name in the UI
function setClientNameUI(clientName) {
    console.log('Your client name:' + clientName);
}


//end doc ready
});