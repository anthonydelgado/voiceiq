/**
 * Created by anthony on 10/22/16.
 */


$(document).ready(function () {

    $('.collapsible').collapsible();

    function makered(text,color = 'red') {
        return '<span class="' + color + '-text">' + text + '</span>';
    }
    function triggerIQ(text,color = 'red') {
        document.body.innerHTML = document.body.innerHTML.replace(text, makered(text,color));
    }

    triggerIQ('bullying');
    triggerIQ('drunk');
    triggerIQ('scared');
    triggerIQ('alone');
    triggerIQ('bully');
    triggerIQ('rape');
    triggerIQ('fear');
    triggerIQ('sad');
    triggerIQ('mad');
    triggerIQ('stressed');
    triggerIQ('stressed out');
    triggerIQ('relationship', 'blue');
    triggerIQ('Linux', 'green');
    triggerIQ('calculus homework', 'green');
    triggerIQ('computer science', 'green');
    triggerIQ('homework', 'green');
    triggerIQ('calculus', 'green');

    triggerIQ('broke up');
    triggerIQ('really stressed');

    triggerIQ('fight');
    triggerIQ('girlfriend', 'blue');


    triggerIQ('tomorrow', 'blue');
    triggerIQ('Saturday', 'blue');
    triggerIQ('Sunday', 'blue');
    triggerIQ('Monday', 'blue');
    triggerIQ('Tuesday', 'blue');
    triggerIQ('Wednesday', 'blue');
    triggerIQ('Thursday', 'blue');
    triggerIQ('Friday', 'blue');
    triggerIQ('new friend', 'blue');



// Initialize collapse button
$(".button-collapse").sideNav();

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
        buttonIQ.html('<i class="material-icons left">play_arrow</i> Listen');
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

    $(this).html('<i class="material-icons left">pause</i> Pause');
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

    $(this).html('<i class="material-icons left">pause</i> Pause');
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

    $(this).html('<i class="material-icons left">play_arrow</i> Resume');
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

// Activity log
    function log(message) {
        Materialize.toast(message, 4000);
    }



    $(document).on('click', '#send-text-iq', function () {

        event.preventDefault();
        var text = $('#text').val();
        // log(text);
        var callID = $(this).attr("data-to");

        // log(callID);

        $.post( "../sms", { text: text, To: callID })
            .done(function( data ) {
                log( data );
            });
        $('#comment-iq').html('<div class="card grey lighten-4"><div class="card-content"><p class="flow-text">' + text + '</p></div></div>')
        $('#text').val('');
    });

}); //DOC READY