/**
 * Created by anthony on 10/22/16.
 */

//API by Anthony
var userAPI = '/userlist';

// console.log('hello');

$.ajax({
    url: userAPI,
    method: 'GET'
}).done(function (response) {
    $.each(response, function (key, value) {


        // console.log(key);
        // console.log(value);
        $('#userlist').append('<li class="collection-item click-to-call white-text transparent" data-user="' + value.username + '"><div>' + value.username + '<a href="#!" class="secondary-content button-join"><i class="material-icons white-text">videocam</i></a> <a href="#!" class="secondary-content"><i class="material-icons white-text">chat</i></a> <a href="#!" class="secondary-content button-join"><i class="material-icons white-text">phone</i></a></div></li>');

    });

});

$(document).on('click','.click-to-call', function () {
    console.log($(this).attr('data-user'));
});