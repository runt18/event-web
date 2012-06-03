/* Author:
Giles Lavelle
*/

(function($){

var colours = 'red red red red yellow yellow yellow green green green green'.split(' ');

var MainDetails = Backbone.Model.extend({
    defaults: {
        name: 'Lan Party',
        location: "Oli's House",
        description: "lorem ipsum"
    }
});

var TimeViewExpander = Expander.extend({
    initialize: function(){
        this.$el.addClass('expander-small');
    },
    expand: function(){
        this.spinArrow();
        this.$el
            .closest('.time')
            .find('.attendees-wrap')
            .toggle('fast');
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

var TimeView = Backbone.View.extend({
    template: '#time-tmpl',
    tagName: 'div',
    className: 'time',

    initialize: function(){
        this.serialize = this.model.toJSON();

        this.model.on('change', function(){
            this.render().then(function(el){
                //log(el);
            });
        }, this);
    },

    render: function(manage) {
        var ratio = this.model.get('confirmed') / this.model.get('total');
        this.insertViews({
            '.piechart-wrap': new PieChartView(ratio),
            '.expander-wrap': new TimeViewExpander(),
            '.attendees-wrap': new AttendeesView()
        });
        return manage(this).render();
    },

    events: {
        'click input.tick': 'update'
    },

    update: function(){
        this.model.increment('confirmed');
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
        this.collection.each(function(model){
            this.insertView(new TimeView({
                model: model
            }));
        }, this);

        return manage(this).render();
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
    template: '#attendee-tmpl',
    tagName: 'li',
    serialize: function(){
        return this.model.toJSON();
    }
});

//View to display entire list of people
var AttendeesView = Backbone.View.extend({
    template: '#attendees-tmpl',
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
        this.collection.each(function(model){
            this.insertView(new AttendeeView({
                model: model
            }));
        }, this);

        return manage(this).render();
    }
});

//Classes for displaying the chat window
var ChatView = Backbone.View.extend({
    template: '#chat-tmpl'
});

//Main view for the entire page
var main = new Backbone.LayoutManager({
    template: '#main-tmpl',
    id: 'wrapper',

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
