/* Author:
Giles Lavelle
*/

require(

['jquery', 'underscore', 'backbone', 'common', 'event', 'auth', 'layoutmanager', 'jquery-ui', 'jquery-ui-timepicker', 'plugins'],
function($, _, Backbone, Common, Event, AuthView){

Backbone.LayoutManager.configure({
    fetch: function(name){
        //debugger;
        return _.template(window.JST[name]);
    },

    render: function(template, context){
        return template(context);
    }
});

var OptionalViewExpander = Common.Expander.extend({
    initialize: function(){
        this.$el.addClass('expander-banner');
    },
    expand: function(){
        this.spinArrow();
        optionalView.togglePanels();
    }
});

// View representing one row in the list of possible times
var TimeView = Backbone.View.extend({
    template: 'plan/time',
    tagName: 'form',
    className: 'time',

    serialize: function(){
        return this.model.toJSON();
    },

    initialize: function(){
        this.model.bind('change', function(){
            this.render();
        }, this);
    },

    // Override default render method to add jQuery plugins
    render: function(manage) {
        return manage(this)
            .render()
            .then(function(el){
                // Cache references to DOM elements for performance
                this.fields = {
                    timestring: this.$('.start'),
                    duration: this.$('.duration'),
                    date: this.$('.date'),
                    remove: this.$('.remove')
                };

                this.fields.date.datepicker({
                    dateFormat: 'dd/mm/yy',
                    minDate: 0
                });

                this.fields.timestring.timepicker({
                    minutes: {
                        interval: 15
                    }
                });

                // Don't show the remove button if there's only one time range
                if (timesListView.collection.length <= 1){
                    this.fields.remove.hide();
                }
            });
    },

    events: {
        'click .remove': 'destroyModel',

        // Updates to contents of text boxes
        'change .date': 'saveDate',
        'change .duration': 'saveDuration',
        'change .start': 'saveDate'
    },

    saveDate: function(){
        // Use the jQuery datepicker function to get a Date object representing the date in the text box
        var date = this.fields.date.datepicker("getDate");

        // Get integer representations of the hour and minute parts of the time
        var hours = this.fields.timestring.timepicker('getHour');
        var minutes = this.fields.timestring.timepicker('getMinute');

        // Update the date with the new time
        date.setHours(hours);
        date.setMinutes(minutes);

        // Set the model's date to this new value
        this.model.set('date', date);
        log(this.model.get('date'));
    },

    saveDuration: function(){
        this.model.set('duration', parseInt(this.fields.duration.val(), 10));
    },

    destroyModel: function(){
        // Remove model from the collection,
        // view automatically re-renders to reflect this
        this.model.destroy();
        this.remove();
    }
});

var TimesListView = Backbone.View.extend({
    initialize: function(collection){
        this.collection = collection;

        // Re-render the view when a time range is added or removed
        this.collection.on('add remove', function(){
            this.render();
        }, this);
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

var TimesView = Backbone.View.extend({
    template: 'plan/times',

    events: {
        'click #add-time': 'addTime'
    },

    addTime: function(){
        var time = new Common.PossibleTime();
        timesList.add(time);
    },

    render: function(manage){
        this.setView('#times', timesListView);
        return manage(this).render();
    }
});

window.rendermap = function(){
    var options = {
        center: new google.maps.LatLng(0, 0),
        zoom: 2,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map($('#map')[0], options);
    
    // Google maps needs a global variable for its callback, but it can be deleted when it's finished
    delete rendermap;
};


var MapView = Backbone.View.extend({
    tagName: 'div',
    id: 'map',

    loadMap: function(){
        var script = $("<script>");
        var key = "AIzaSyCb9d96VBOWpB6STnKEyGCaXyG80L2tw-0";
        var url = "http://maps.googleapis.com/maps/api/js" +
            "?key=" + key +
            "&sensor=false" +
            "&callback=rendermap";
        script[0].src = url;
        script.appendTo('body');
    },

    // Override default render method to add Google Map
    render: function(manage) {
        return manage(this)
            .render()
            .then(function(el){
                this.loadMap();
            });
    }
});

var DetailsView = Backbone.View.extend({
    template: 'plan/details',
    tagName: 'form',

    render: function(manage) {
        return manage(this)
            .render()
            .then(function(el){
                this.$('#invitees').tagsInput({
                    defaultText: "Who's invited?"
                });
            });
    }
});

var OptionalView = Backbone.View.extend({
    template: 'plan/optional',
    id: 'optional',

    events: {
        'click #toggle-map': 'toggleMap'
    },

    togglePanels: function(){
        this.elems.panels.toggle('fast');
    },

    toggleMap: function(){
        this.elems.leftPanel.toggleClass('in');
    },

    render: function(manage){
        this.insertViews({
            '.expander-wrap': new OptionalViewExpander(),
            '#map-wrap': new MapView()
        });

        return manage(this)
            .render()
            .then(function(el){
                this.elems = {
                    panels: this.$('.panels'),
                    leftPanel: this.$('.left-panel')
                };
            });
    }
});

// Create the top-level Model representing the entire event
var mainEvent = new Event();

var
    title = new Common.Title({
        page_title: 'Plan Event'
    }),
    headerView = new Common.HeaderView({
        model: title
    });

var
    authView = new AuthView(),
    
    detailsView = new DetailsView([
        {}
    ]),
    optionalView = new OptionalView(),
    finishButtonView = new Common.FinishButtonView(),
    footerView  = new Common.FooterView();

finishButtonView.finish = function(){
    // TODO Save model and validate it before redirecting
    
    mainEvent.save();

    //window.location.href = "view.html";
};

var
    // Create the Collection representing all times at which the event can happen
    timesList = new Common.PossibleTimes([{}]);
    // Create the list View to display this Collection
    timesListView = new TimesListView(timesList),
    // Create the wrapper View to hold the list and the add button
    timesView = new TimesView();

var titleView = new Common.TitleView({
    model: title
});

// Main view for the entire page
var main = new Backbone.LayoutManager({
    template: 'plan/main',
    id: 'wrapper',

    // Add all subviews to the main layout
    views: {
        '#header': headerView,
        '#login-wrapper': authView,
        '#main-details': detailsView,
        '#times-wrapper': timesView,
        '#optional-wrapper': optionalView,
        '#finish-button-wrapper': finishButtonView,
        '#footer': footerView
    }
});

main.$el.appendTo('body');
main.render();

});
