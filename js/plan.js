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
            .find('form')
            .toggle('fast');

    }
});

var TimeView = Backbone.View.extend({
    template: '#time-tmpl',

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
                    date: this.$('.date')
                };

                $(el).find('.date').datepicker({
                    dateFormat: 'dd/mm/yy'
                });

                $(el).find('.start').timepicker();
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
    },

    saveDuration: function(){
        this.model.set('duration', parseInt(this.fields.duration.val(), 10));
    },

    destroyModel: function(){
        // Remove model from the collection,
        // view automatically re-renders to reflect this
        this.model.destroy();
    }
});

var TimesView = Backbone.View.extend({
    template: '#times-tmpl',

    initialize: function(times){
        this.collection = new Common.PossibleTimes(times);
        this.collection.on('add remove', function(){
            this.render();
        }, this);
    },

    events: {
        'click #add-time': 'addTime'
    },

    addTime: function(){
        var time = new Common.PossibleTime();
        this.collection.add(time);
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

var FinishView = Backbone.View.extend({
    template: '#finish-tmpl',

    events: {
        'click #finish': 'finish'
    },

    finish: function(){
        log('done');
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
        var mapWrap = this.$('#map-wrap');

        this.$('#toggle-map').toggle(
            function(){
                $(this).val('Map');
                mapWrap.slideUp('fast');
                //google.maps.event.trigger(map, "resize");
            },
            function(){
                $(this).val('Hide');
                mapWrap.slideDown('fast');
                //google.maps.event.trigger(map, "resize");
            }
        );
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

//Main view for the entire page
var main = new Backbone.LayoutManager({
    template: '#main-tmpl',
    id: 'wrapper',

    views: {
        '#header': new Common.HeaderView(),
        '#main-details': new DetailsView([{}]),
        '#times': new TimesView([{}]),
        '#optional': new OptionalView(),
        '#finish-wrapper': new FinishView(),
        '#footer': new Common.FooterView()
    }
});

main.$el.appendTo('body');
main.render();

});
