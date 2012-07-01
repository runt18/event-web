/* Author:
Giles Lavelle
*/

require(

['jquery', 'underscore', 'backbone', 'common', 'event', 'auth', 'piechart', 'layoutmanager', 'jquery-ui', 'plugins'],
function($, _, Backbone, Common, Event, AuthView, PieChartView){

Backbone.LayoutManager.configure({
    fetch: function(name){
        //debugger;
        return _.template(window.JST[name]);
    },

    render: function(template, context){
        return template(context);
    }
});

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

var TimeView = Backbone.View.extend({
    template: 'view/time',
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
    template: 'view/details',
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
    template: 'view/attendee',
    tagName: 'li',
    serialize: function(){
        return this.model.toJSON();
    }
});

var FinishView = Backbone.View.extend({
    tagName: 'div',
    template: 'view/finishbox',
    className: 'finish-box'
});

//View to display entire list of people
var AttendeesView = Backbone.View.extend({
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
    template: 'view/chat'
});

$.getJSON('test-data.json', function(data){
    //log(data);

    // Create the Model representing the entire event from the data loaded from the server
    var mainEvent = new Event(data);

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
        authView = new AuthView();
        globalAttendeesView = new AttendeesView(mainEvent.get('invitees')),
        timesView = new TimesListView(mainEvent.get('times')),
        chatView = new ChatView(),
        finishView = new FinishView();
        finishButtonView = new Common.FinishButtonView();
        footerView = new Common.FooterView();

    var titleView = new Common.TitleView({
        model: title
    });

    //Main view for the entire page
    var main = new Backbone.LayoutManager({
        template: 'view/main',
        id: 'wrapper',

        // Add all subviews to the main layout
        views: {
            '#header': headerView,
            '#login-wrapper': authView,
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
