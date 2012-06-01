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

// App.timesController = Em.Object.create({
//     times: [
//         PotentialTime.create()
//     ]
// });

// App.AddTimeRangeView = Em.View.extend({
//     add: function(){
//         var time = PotentialTime.create();
//         var times = App.timesController.get('times');

//         var view = Em.View.create({

//             templateName: 'timerange',
//             lastOne: times.length === 1,

//             didInsertElement: function(){
//                 $('.date').datepicker({
//                     //showAnim: 'fold'
//                 });
//             }
//         });

//         times.pushObject(time);
//         view.appendTo('#time');
//     }
// });

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

$('#invitees').tagsInput();
//initialize();

var TimeView = Backbone.View.extend({
    template: '#time-tmpl',

    initialize: function(){
        this.serialize = this.model.toJSON();
        this.views = {

        };
        this.model.bind('change', function(){
            this.render().then(function(el){
                //log(el);
            });
        }, this);
    }
});

var TimesView = Backbone.View.extend({
    template: '#times-tmpl',

    initialize: function(){
        this.collection = new PossibleTimes([{}]);
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
        this.serialize = this.model.toJSON();
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
        '#times': new TimesView(),
        '#optional': new OptionalView()
    }
});

main.$el.appendTo('body');
main.render();

}(jQuery));
