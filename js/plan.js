/* Author:
Giles Lavelle
*/
var map;

require(

['jquery', 'underscore', 'backbone', 'common', 'layoutmanager', 'jquery-ui', 'plugins'],
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

        // this.views = {

        // };

        // this.model.bind('change', function(){
        //     this.render().then(function(el){
        //         //log(el);
        //     });
        // }, this);
    },

    // Override default render method to add jQuery plugins
    render: function(manage) {
        return manage(this)
            .render()
            .then(function(el){

                this.fields = {
                    start: this.$('.start'),
                    duration: this.$('.duration'),
                    date: this.$('.date')
                };

                $(el).find('.date').datepicker({
                    dateFormat: 'dd/mm/yy'
                });
            });
    },

    events: {
        'click .remove': 'destroyModel',

        // Updates to contents of text boxes
        'change .date': 'saveDate',
        'change .duration': 'saveDuration',
        'change .start': 'saveStart'
    },

    saveDate: function(){
        this.model.set('date', this.fields.date.val());
    },

    saveDuration: function(){
        this.model.set('duration', this.fields.duration.val());
    },

    saveStart: function(){
        this.model.set('start', this.fields.start.val());
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


var MapView = Backbone.View.extend({
    // TODO: Load Google Maps script here so it's only loaded if the user actually wants the map
    tagName: 'div',

    initialize: function(){
        this.el.height = 100;
        this.el.width = 100;
    },

    renderMap: function(el){
        var options = {
            center: new google.maps.LatLng(-34.397, 150.644),
            zoom: 1,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(this.el, options);

    },

    // Override default render method to add Google Map
    render: function(manage) {
        return manage(this)
            .render()
            .then(function(el){
                this.renderMap();
                // new GMaps({
                //     div: '#map',
                //     lat: -12.043333,
                //     lng: -77.028333
                // });
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
                $(this).val('Pick location on map');
                mapWrap.hide('fast');
            },
            function(){
                $(this).val('Hide map');
                mapWrap.show();
                google.maps.event.trigger(map, "resize");
                //map.setZoom( map.getZoom() );
            }
        );
    },

    initialize: function(){
        this.model.bind('change', function(){
            this.render().then(function(el){
                //log(el);
            });
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
