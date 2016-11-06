/**
 * Created by anthony on 10/22/16.
 */


$(document).ready(function () {

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


}); //DOC READY