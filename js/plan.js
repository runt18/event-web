/* Author:
Giles Lavelle
*/

function initialize() {
    var myOptions = {
        center: new google.maps.LatLng(-34.397, 150.644),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"),
        myOptions);
}

// App.Optional = Em.View.extend({
//     finish: function(){

//     },
//     pick: function(){
//         if (window.google){
//             initialize();
//         } else {
//             $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyCb9d96VBOWpB6STnKEyGCaXyG80L2tw-0&sensor=false&callback=initialize');
//         }
//     }
// });


(function($){

//$('#invitees').tagsInput();
//initialize();

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

                $(el).find('.date').datepicker();
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
        this.collection = new PossibleTimes(times);
        this.collection.on('add remove', function(){
            this.render();
        }, this);
    },

    events: {
        'click #add-time': 'addTime'
    },

    addTime: function(){
        var time = new PossibleTime();
        this.collection.add(time);
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

var Optional = Backbone.Model.extend({
    defaults: {

    }
});


var MapView = Backbone.View.extend({
    template: '#map-tmpl'
});

var OptionalView = Backbone.View.extend({
    template: '#optional-tmpl',
    model: new Optional(),

    views: {
        '#map-wrap': new MapView()
    },

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
                mapWrap.show('fast');
            }
        );
    },

    initialize: function(){
        this.model.bind('change', function(){
            this.render().then(function(el){
                //log(el);
            });
        }, this);
    }
});

//Main view for the entire page
var main = new Backbone.LayoutManager({
    template: '#main-tmpl',

    views: {
        '#times': new TimesView([{}]),
        '#optional': new OptionalView()
    }
});

main.$el.appendTo('body');
main.render();

}(jQuery));
