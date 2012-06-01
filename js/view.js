/* Author:
Giles Lavelle
*/

(function($){

var colours = 'red red red red yellow yellow yellow green green green green'.split(' ');

var PossibleTime = Backbone.Model.extend({
    defaults: {
        start: '12:00',
        duration: 60,
        date: '12/12/12',
        confirmed: 14,
        total: 17
    }
});

var MainDetails = Backbone.Model.extend({
    defaults: {
        name: 'Lan Party',
        location: "Oli's House",
        description: "lorem ipsum"
    }
});


var PossibleTimes = Backbone.Collection.extend({
    model: PossibleTime
});

var TimeView = Backbone.View.extend({
    template: '#time',
    initialize: function(){
        this.serialize = this.model.toJSON();
        this.model.bind("change", this.render, this);
    },

    events: {
        'click input.tick': 'update'
    },
    update: function(){
        log('hi');
        this.model.set('confirmed', 5);
    }
});

var Expander = Backbone.View.extend({
    template: '#expander',
    events: {
        'click': 'expand'
    },
    expand: function(){
        this.$el.find('.expander').toggleClass('expander-closed');
    }
});

var PieChartView = Backbone.View.extend({
    template: '#piechart',

    colour: function(){
        var index = Math.floor(this.ratio * 10);
        var colour = colours[index];

        return colour;
    },

    draw: function(){
        var canvas = this.$el.find('canvas')[0];
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

    render: function(manage) {
        var a = manage(this).render();
        this.draw();
        return a;
    },

    update: function(ratio){
        this.ratio = ratio;
        this.draw();
    },

    initialize: function(ratio){
        this.ratio = ratio;
    }
});

var TimesListView = Backbone.View.extend({
    template: '#times-tmpl',

    initialize: function(){
        this.collection = new PossibleTimes([{}]);
    },

    render: function(manage){
        var view = manage(this);
        this.collection.each(function(model){
            view.insert('div', new TimeView({
                model: model,
                views: {
                    '.piechart-wrap': new PieChartView(0.5),
                    '.expander-wrap': new Expander()
                }
            }));
        });

        return view.render();
    }
});

var DetailsView = Backbone.View.extend({
    template: '#details',
    model: new MainDetails(),
    serialize: function(){
        return this.model.toJSON();
    }
});

var Attendee = Backbone.Model.extend({
    defaults: {
        name: 'bob'
    }
});

var Attendees = Backbone.Collection.extend({
    model: Attendee
});

var AttendeesView = Backbone.View.extend({
    template: '#attendees'
});

var AttendeeView = Backbone.View.extend({
    template: '#attendee',
    tagName: 'li',
    serialize: function(){
        return this.model.toJSON();
    }
});

var GlobalAttendeesView = Backbone.View.extend({
    template: '#global-attendees',

    initialize: function(){
        this.collection = new Attendees([{},{name: 'tim'}]);
    },

    render: function(manage){
        var view = manage(this);
        this.collection.each(function(model){
            view.insert(new AttendeeView({
                model: model
            }));
        });

        return view.render();
    }
});

var ChatView = Backbone.View.extend({
    template: '#chat'
});

var main = new Backbone.LayoutManager({
    template: '#main-layout',

    views: {
        '#main-details': new DetailsView(),
        '#global-attendees-list': new GlobalAttendeesView(),
        '#time-wrap': new TimesListView(),
        '#chat-view': new ChatView()
    }
});

main.$el.appendTo('body');
main.render();



// var AttendeesView = Backbone.View.extend({
//     tagName: 'ul',
//     className: 'attendees',
//     template: $('#attendees').html(),

//     render: function(){
//         var tmpl = _.template(this.template);

//         this.$el.html(tmpl(this.model.toJSON()));
//         return this;
//     }
// });



// var GlobalAttendeesView = Backbone.View.extend({
//     tagName: 'li',
//     className: 'global-attendees',
//     template: $('#global-attendees').html(),
//     model: new Backbone.Model.extend({
//         name: 'bob'
//     }),

//     render: function(){
//         var tmpl = _.template(this.template);

//         this.$el.html(tmpl(this.model.toJSON()));
//         return this;
//     }
// });

//var b = new GlobalAttendees();
//var a = new GlobalAttendeesView({model:b.model}).render();

//var timesList = new TimesListView();

}(jQuery));

/*
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
