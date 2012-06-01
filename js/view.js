/* Author:
Giles Lavelle
*/

(function($){

var colours = 'red red red red yellow yellow yellow green green green green'.split(' ');

var PossibleTime = Backbone.Model.extend({
    defaults: {
        start: Time.timeNow,
        duration: 60,
        date: Time.dateNow,
        confirmed: 0,
        total: 1
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

var Expander = Backbone.View.extend({
    template: '#expander',
    events: {
        'click': 'expand'
    },
    expand: function(){
        this.$el.find('.expander').toggleClass('expander-closed');
    }
});

var TimeView = Backbone.View.extend({
    template: '#time-tmpl',
    tagName: 'div',

    initialize: function(){
        this.serialize = this.model.toJSON();

        var ratio = this.model.get('confirmed') / this.model.get('total');
        this.views = {
            '.piechart-wrap': new PieChartView(ratio),
            '.expander-wrap': new Expander(),
            '.attendees-wrap': new AttendeesView()
        };

        this.model.bind('change', function(){
            this.render().then(function(el){
                log(el);
            });
        }, this);
    },

    events: {
        'click input.tick': 'update'
    },

    update: function(){
        this.model.set('confirmed', 5);
    }
});

var TimesListView = Backbone.View.extend({
    template: '#times-tmpl',

    initialize: function(){
        this.collection = new PossibleTimes([
            {
                total: 10,
                confirmed: 7
            },
            {
                total: 3,
                confirmed: 2
            }
        ]);
    },

    render: function(manage){
        var view = manage(this);
        this.collection.each(function(model){
            view.insert(new TimeView({
                model: model
            }));
        });

        return view.render();
    }
});

var DetailsView = Backbone.View.extend({
    template: '#details-tmpl',
    model: new MainDetails(),
    serialize: function(){
        return this.model.toJSON();
    }
});

// Classes for displaying lists of people who have been invited to the event

//Model representing one person
var Attendee = Backbone.Model.extend({
    defaults: {
        name: 'Bob'
    }
});

//Collection representing a group of people
var Attendees = Backbone.Collection.extend({
    model: Attendee
});

//View to display one person in a list
var AttendeeView = Backbone.View.extend({
    template: '#attendee',
    tagName: 'li',
    serialize: function(){
        return this.model.toJSON();
    }
});

//View to display entire list of people
var AttendeesView = Backbone.View.extend({
    template: '#attendees',
    tagName: 'ul',
    initialize: function(){
        this.collection = new Attendees([
            {},
            {
                name: 'Tim'
            }
        ]);
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

//Classes for displaying the chat window
var ChatView = Backbone.View.extend({
    template: '#chat-tmpl'
});

//Main view for the entire page
var main = new Backbone.LayoutManager({
    template: '#main-tmpl',

    views: {
        '#details': new DetailsView(),
        '#global-attendees': new AttendeesView(),
        '#times': new TimesListView(),
        '#chat': new ChatView()
    }
});

main.$el.appendTo('body');
main.render();

}(jQuery));
