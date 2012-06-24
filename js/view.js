/* Author:
Giles Lavelle
*/

require(

['jquery', 'underscore', 'backbone', 'common', 'layoutmanager', 'jquery-ui', 'plugins'],
function($, _, Backbone, Common){

var MainDetails = Backbone.Model.extend({
    urlRoot: '/foo',
    defaults: {
        name: '',
        location: '',
        description: "No description given"
    }
});

var TimeViewExpander = Common.Expander.extend({
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
    tagName: 'canvas',
    className: 'piechart',

    colour: function(){
        // Determine the colour of the pie chart
        // based on how full it is
        var n = this.ratio,
            r = Math.round(255 * (1 - n)),
            g = Math.round(255 * n),
            b = 0;
        var colour = 'rgb(' + r + ',' + g + ',' + b + ')';
        return colour;
    },

    draw: function(ratio){
        var ctx = this.context;
        var size = this.size;
        var half = this.half;

        // Clear the old image
        ctx.clearRect(0, 0, size, size);

        ctx.fillStyle = this.colour();
        ctx.beginPath();

        // Start at the center
        ctx.moveTo(half, half);

        // Draw a line to the top
        ctx.lineTo(half, 0);

        // Draw an arc clockwise round from north
        var offset = (Math.PI / 2);
        var start = -offset;
        var end = (Math.PI * 2 * ratio) - offset;
        ctx.arc(half, half, half, start, end, false);

        // Connect the arc back to the center, fill the shape in
        ctx.fill();
    },

    animate: function(){
        var that = this; // Save reference to keep access to draw function
        var duration = 0.6; // seconds
        var fps = 30;
        var frames = fps * duration;
        var step = duration / frames;

        var drawRatio = this.oldRatio; // Ratio to be drawn on each frame
        var endRatio = this.ratio; //Ratio to reach

        var direction = endRatio > drawRatio ? 1 : -1; // Is it increasing or decreasing?
        step *= direction;

        // Run the animation
        var timer = setInterval(function(){
            drawRatio += step;
            if(direction * drawRatio > direction * endRatio){
                clearInterval(timer);
            }
            that.draw(drawRatio);
        }, duration * 1000 / frames);
    },

    render: function(manage) {
        return manage(this).render().then(function(){
            this.el.height = this.size;
            this.el.width = this.size;

            // Cache a reference to the drawing context
            this.context = this.el.getContext('2d');
            if(this.ratio){
                this.animate();
            }
        });
    },

    initialize: function(ratio, oldRatio){
        this.ratio = ratio;
        this.oldRatio = oldRatio;
        this.size = 30;
        this.half = this.size / 2;
    }
});

var TimeView = Backbone.View.extend({
    template: '#time-tmpl',
    tagName: 'div',
    className: 'time',

    serialize: function(){
        return this.model.toJSON();
    },

    initialize: function(){
        this.model.on('change', function(){
            this.render().then(function(el){
                var isAttending  = this.model.get('isAttending');
                $(el).find('.tick').attr('checked', isAttending);
            });
        }, this);
    },

    render: function(manage) {
        var ratio = this.model.get('ratio');
        var oldRatio = this.model.get('oldRatio');

        this.insertViews({
            '.piechart-wrap': new PieChartView(ratio, oldRatio),
            '.expander-wrap': new TimeViewExpander(),
            '.attendees-wrap': new AttendeesView(this.model.get('attendees'))
        });
        return manage(this).render();
    },

    events: {
        'click input.tick': 'updateAttendeeData'
    },

    updateAttendeeData: _.throttle(function(){
        var attendees = this.model.get('attendees');
        var isAttending = this.model.get('isAttending');

        if(isAttending){
            var index = attendees.indexOf('you');
            attendees.splice(index, 1);
        } else {
            attendees.push('you');
        }

        this.model
            .set('attendees', attendees)
            .trigger('change:attendees');

    }, 500)
});

var TimesListView = Backbone.View.extend({
    template: '#times-tmpl',

    initialize: function(times){
        this.collection = new Common.PossibleTimes(times);
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
    initialize: function(attendees){
        this.collection = new Attendees(attendees);
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

$.getJSON('test-data.json', function(data){
    //log(data);

    // Create the Model representing the entire event from the data loaded from the server
    var mainEvent = new Common.Event(data);

    // Create the model for the main event details and its corresponding View
    var
        mainDetails = new MainDetails({
            name: data.name,
            location: data.location
        }),
        detailsView = new DetailsView({
            model: mainDetails
        });

    // Create the model for the page header and its corresponding View
    var
        title = new Common.Title({
            page_title: 'View Event'
        }),
        headerView = new Common.HeaderView({
            model: title
        });
    
    var
        loginView = new Common.LoginView();
        globalAttendeesView = new AttendeesView(mainEvent.get('invitees')),
        timesView = new TimesListView(mainEvent.get('times')),
        chatView = new ChatView(),
        finishView = new Common.FinishView();
        finishButtonView = new Common.FinishButtonView();
        footerView = new Common.FooterView();

    var titleView = new Common.TitleView({
        model: title
    });

    //Main view for the entire page
    var main = new Backbone.LayoutManager({
        template: '#main-tmpl',
        id: 'wrapper',

        // Add all subviews to the main layout
        views: {
            '#header': headerView,
            '#login-wrapper': loginView,
            '#details': detailsView,
            '#global-attendees': globalAttendeesView,
            '#times': timesView,
            '#chat': chatView,
            '#finish-button-wrapper': finishButtonView,
            '#footer': footerView,
            '#finish-wrapper': finishView
        }
    });

    main.$el.appendTo('body');
    main.render();

});

});
