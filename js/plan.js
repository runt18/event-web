/* Author:
Giles Lavelle
*/

var App = Em.Application.create();

App.Time = {
    timeNow: (function(){
        var d = new Date();
        return d.getHours() + ":" + d.getMinutes();
    }()),

    dateNow: (function(){
        var d = new Date();
        return d.getDate() + '/' + d.getMonth() + '/' + d.getYear();
    }())
};

function initialize() {
    var myOptions = {
        center: new google.maps.LatLng(-34.397, 150.644),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"),
        myOptions);
}


PotentialTime = Em.Object.extend({
    start: '12:00',
    duration: 60,
    date: '12/12/12'
});

App.timesController = Em.Object.create({
    times: [
        PotentialTime.create()
    ]
});

App.AddTimeRangeView = Em.View.extend({
    add: function(){
        var time = PotentialTime.create();
        var times = App.timesController.get('times');
        var view = Em.View.create({
            templateName: 'timerange',
            lastOne: times.length === 1,
            didInsertElement: function(){
                $('.date').datepicker({
                    showAnim: 'fold'
                });
                $('.start').val(App.Time.timeNow);
                $('.date').val(App.Time.dateNow);
            }
        });


        times.pushObject(time);
        view.appendTo('#time');
    }
});

App.OptionalExpander = Em.View.extend({
    expand: function(){
        $('#optional-expander').toggleClass('down');
        $('#optional').toggle('fast');
    }
});

App.Optional = Em.View.extend({
    finish: function(){

    },
    pick: function(){
        if (window.google){
            initialize();
        } else {
            $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyCb9d96VBOWpB6STnKEyGCaXyG80L2tw-0&sensor=false&callback=initialize');
        }
    }
});


$(document).ready(function(){
    $('#invitees').tagsInput();
    //initialize();
});
