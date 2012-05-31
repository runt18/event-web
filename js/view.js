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

App.PieChartView = Em.View.extend({
    templateName: 'piechart',
    //confirmedBinding: 'App.timesController.times[0].confirmed',
    //totalBinding: 'App.timesController.times[0].total',
    // ratio: function(){
    //     console.log(this.get('confirmedBinding'));
    // }.observes('confirmedBinding', 'totalBinding'),
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
    }.observes('ratio'),

    animate: function(){
        var oldRatio = 0.5;
        var newRatio = 1;
        var diff = newRatio - oldRatio;
        var step = diff / 10;
        var i = setInterval(function(){
            oldRatio += step;
            this.set('oldratio', oldRatio);
            this.get('draw');
            if(oldRatio >= newRatio){
                clearInterval(i);
            }
        }, 100);
    }
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

App.PotentialTime = Em.Object.extend({
    start: '12:00',
    duration: 60,
    date: '12/12/12',
    confirmed: 1,
    total: 2,
    attendees: [
        'bob', 'tim'
    ]
});

App.timesController = Em.Object.create({
    times: [
        App.PotentialTime.create(),
        App.PotentialTime.create(),
        App.PotentialTime.create()
    ]
});

App.TimesView = Em.ContainerView.extend({
    didInsertElement: function(){
        // var canvases = $('canvas');
        // var times = App.timesController.get('times');
        // for (var i = 0; i < times.length; i++){
        //     var time = times[i];
        //     var ratio = time.confirmed / time.total;
        //     var canvas = canvases[i];
        //     var pie = PieChart.create({
        //         ratio: ratio,
        //         canvas: canvas
        //     });
        //     pie.draw();
        //     App.timesController.times[i].set('pie', pie);
        //}
    }
});

App.TimeView = Em.View.extend({
    a: function(){
        if(this.isChecked){
            App.timesController.times[0].incrementProperty('confirmed');
            App.timesController.times[0].pie.set('ratio', 1);
        } else {
            App.timesController.times[0].decrementProperty('confirmed');
        }
    }.observes('isChecked')
    //pie: PieChart.create()
});

$(document).ready(function(){

});
