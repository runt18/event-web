/* Author:
Giles Lavelle
*/

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
    start: App.Time.timeNow,
    duration: 60,
    date: App.Time.dateNow
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
                    //showAnim: 'fold'
                });
            }
        });

        times.pushObject(time);
        view.appendTo('#time');
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
