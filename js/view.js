/* Author:
Giles Lavelle
*/

(function($){

var colours = [
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

var PossibleTime = Backbone.Model.extend({
    defaults: {
        start: '12:00',
        duration: 60,
        date: '12/12/12',
        confirmed: 14,
        total: 17,
        attendees: [
            'bob', 'tim'
        ]
    }
});

var PossibleTimes = Backbone.Collection.extend({
    model: PossibleTime
});

var TimeView = Backbone.View.extend({
    tagName: 'div',
    className: 'time-wrap',
    template: $('#time').html(),

    render: function(){
        var tmpl = _.template(this.template);

        this.$el.html(tmpl(this.model.toJSON()));
        return this;
    }
});

var AttendeesView = Backbone.View.extend({
    tagName: 'ul',
    className: 'attendees',
    template: $('#attendees').html(),


    render: function(){
        var tmpl = _.template(this.template);

        this.$el.html(tmpl(this.model.toJSON()));
        return this;
    }
});


var GlobalAttendeesView = Backbone.View.extend({
    tagName: 'ul',
    className: 'global-attendees',
    template: $('#global-attendees').html(),
    model: new Backbone.Model.extend({
        name: 'bob'
    }),

    render: function(){
        var tmpl = _.template(this.template);

        this.$el.html(tmpl(this.model.toJSON()));
        return this;
    }
});

//var a = new GlobalAttendeesView().render();


var TimesListView = Backbone.View.extend({
    el: $('#time-list'),

    initialize: function(){
        this.collection = new PossibleTimes([{}]);
        this.render();
    },

    render: function(){
        var that = this;
        _.each(this.collection.models, function(item){
            that.renderTime(item);
        }, this);
    },

    renderTime: function (item) {
        var timeView = new TimeView({
            model: item
        });
        this.$el.append(timeView.render().el);
    }
});

var timesList = new TimesListView();

var PieChartView = Backbone.View.extend({
    colour: function(){
        var index = Math.floor(this.ratio * 10);
        var colour = colours[index];

        return colour;
    },

    draw: function(){
        var canvas = $('canvas')[this.index];
        var ctx = canvas.getContext('2d');

        var size = canvas.height;
        var half = size / 2;

        var ratio = this.ratio;

        ctx.clearRect(0, 0, size, size);

        ctx.fillStyle = this.colour();
        ctx.beginPath();
        ctx.moveTo(half, half);
        ctx.lineTo(half, 0);

        var offset = (Math.PI / 2);
        var start = -offset;
        var end = (Math.PI * 2 * ratio) - offset;
        ctx.arc(half, half, half, start, end, false);

        ctx.fill();
    },

    update: function(ratio){
        this.ratio = ratio;
        this.draw();
    },

    initialize: function(ratio, index){
        this.index = index;
        this.ratio = ratio;
        this.draw();
    }
});

var c = new PieChartView(0.3, 0);

}(jQuery));

/*App.Title = Em.View.extend({
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
});*/
