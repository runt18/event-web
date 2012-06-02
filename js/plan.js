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

    // initialize: function(){
    //     this.views = {

    //     };

    //     this.model.bind('change', function(){
    //         this.render().then(function(el){
    //             //log(el);
    //         });
    //     }, this);
    // },

    // Override default render method to add jQuery plugins
    render: function(manage) {
        return manage(this)
            .render()
            .then(function(el){
                $(el).find('.date').datepicker();
            });
    },

    events: {
        'click .remove': 'destroyModel',
        'change .date': 'saveDate',
        'change .duration': 'saveDuration',
        'change .start': 'saveStart'
    },

    saveDate: function(){
        this.model.set('date', this.$('.date').val());
    },

    saveDuration: function(){
        this.model.set('duration', this.$('.duration').val());
    },

    saveStart: function(){
        this.model.set('start', this.$('.start').val());
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

var OptionalView = Backbone.View.extend({
    'template': '#optional-tmpl',
    model: new Optional(),

    initialize: function(){
        //this.serialize = this.model.toJSON();
        this.views = {

        };
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
