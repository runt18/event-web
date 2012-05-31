/* Author:
Giles Lavelle
*/

colours = [
    'red',
    'red',
    'red',
    'red',
    'yellow',
    'yellow',
    'yellow',
    'green',
    'green',
    'green',
    'green'
];

PieChart = Em.Object.extend({
    ratio: 1,

    colour: function(){
        var ratio = this.get('ratio');
        var index = Math.floor(ratio * 10);
        var colour = colours[index];

        return colour;
    }.property('ratio'),

    draw: function(){
        var canvas = this.get('canvas');
        var ctx = canvas.getContext('2d');

        var size = canvas.height;
        var half = size / 2;

        var ratio = this.get('ratio');

        ctx.clearRect(0, 0, size, size);

        ctx.fillStyle = this.get('colour');
        ctx.beginPath();
        ctx.moveTo(half, half);
        ctx.lineTo(half, 0);

        var offset = (Math.PI / 2);
        var start = -offset;
        var end = (Math.PI * 2 * ratio) - offset;
        ctx.arc(half, half, half, start, end, false);

        ctx.fill();
    }.observes('ratio')
});


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
        for (var i = 0; i < this.times.length; i++){
            var time = this.times[i];
            var ratio = time.confirmed / time.total;
            var canvas = canvases[i];
            var pie = PieChart.create({
                ratio: ratio,
                canvas: canvas
            });
            pie.draw();
        }
    },
    times: [
        {
            start: '12:00',
            duration: 60,
            date: '12/12/12',
            confirmed: 14,
            total: 17,
            attendees: [
                'bob', 'tim'
            ]
        },
        {
            start: '12:00',
            duration: 60,
            date: '12/12/12',
            confirmed: 70,
            total: 84,
            attendees: [
                'tom'
            ]
        }
    ]
});

$(document).ready(function(){

});
