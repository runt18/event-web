/* Author:
Giles Lavelle
*/
var map;

require(

['jquery', 'underscore', 'backbone', 'common', 'layoutmanager', 'jquery-ui', 'jquery-ui-timepicker', 'plugins'],
function($, _, Backbone, Common){

var OptionalViewExpander = Common.Expander.extend({
    initialize: function(){
        this.$el.addClass('expander-banner');
    },
    expand: function(){
        this.spinArrow();
        this.$el
            .closest('#optional')
            .find('.panels')
            .toggle('fast');

    }
});

var TimeView = Backbone.View.extend({
    template: '#time-tmpl',
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
                //log(el);
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
                if (timesView.collection.length <= 1){
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
    initialize: function(times){
        this.collection = new Common.PossibleTimes(times);
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
    template: '#times-tmpl',

    initialize: function(times){
        this.list = new TimesListView(times);
    },

    events: {
        'click #add-time': 'addTime'
    },

    views: {
        '#times': new TimesListView()//this.list
    },

    addTime: function(){
        var time = new Common.PossibleTime();
        this.list.collection.add(time);
    },

    render: function(manage){
        return manage(this).render();
    }
});

var Optional = Backbone.Model.extend({
    defaults: {

    }
});

window.rendermap = function(){
    var options = {
        center: new google.maps.LatLng(0, 0),
        zoom: 2,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map($('#map')[0], options);
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
    template: '#details-tmpl',

    events: {

    },

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
    template: '#optional-tmpl',
    model: new Optional(),
    id: 'optional',

    events: {
        'click #toggle-map': 'toggleMap'
    },

    toggleMap: function(){
        $('.left-panel').toggleClass('in');
    },

    initialize: function(){
        this.model.bind('change', function(){
            this.render();
        }, this);
    },

    render: function(manage) {
        this.insertViews({
            '.expander-wrap': new OptionalViewExpander(),
            '#map-wrap': new MapView()
        });
        return manage(this).render();
    }
});

var mainEvent = new Common.Event();

var header = new Common.Header({
    page_title: 'Plan Event'
});

var headerView   = new Common.HeaderView({
        model: header
    }),
    timesView    = new TimesView([
        {}
    ]),
    detailsView  = new DetailsView([
        {}
    ]),
    optionalView = new OptionalView(),
    finishButtonView   = new Common.FinishButtonView(),
    footerView   = new Common.FooterView();

//Main view for the entire page
var main = new Backbone.LayoutManager({
    template: '#main-tmpl',
    id: 'wrapper',

    views: {
        '#header': headerView,
        '#main-details': detailsView,
        '#times-wrapper': timesView,
        '#optional-wrapper': optionalView,
        '#finish-wrapper': finishButtonView,
        '#footer': footerView
    }
});

main.$el.appendTo('body');
main.render();

});
