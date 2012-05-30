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

App.drawPieChart = function(percent, canvas){
    var size = canvas.height;
    var half = size / 2;
    var ctx = canvas.getContext('2d');
    var colour = 'red';

    if(percent > 33){
        colour = 'yellow';
    }
    if(percent > 66){
        colour = 'green';
    }

    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.moveTo(half, half);
    ctx.lineTo(half, 0);
    ctx.arc(half, half, half, -(Math.PI / 2), (Math.PI * 2 / 100 * percent) - (Math.PI / 2), false);
    ctx.fill();
};

App.Title = Em.View.extend({
    name: 'Lan Party',
    location: "Oli's House",
    description: "lorem ipsum"
});

App.Invitees = Em.View.extend({
    invitees: [
        'Bob',
        'Tim',
        'Tom'
    ]
});

App.Times = Em.View.extend({
    didInsertElement: function(){
        var canvases = $('canvas');
        for (var i = 0; i < this.times.length; i++) {
            var percent = this.times[i].confirmed / this.times[i].total * 100;
            var canvas = canvases[i];
            App.drawPieChart(percent, canvas);
        }
    },
    times: [
        {
            start: '12:00',
            duration: 60,
            date: '12/12/12',
            confirmed: 2,
            total: 3
        },
        {
            start: '12:00',
            duration: 60,
            date: '12/12/12',
            confirmed: 9,
            total: 84
        }
    ]
});

App.OptionalExpander = Em.View.extend({
    expand: function(){
        $('#optional-expander').toggleClass('down');
        $('#optional').toggle('fast');
    }
});

$(document).ready(function(){

});
