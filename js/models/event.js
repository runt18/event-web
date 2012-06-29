define(

['underscore', 'backbone'],
function(_, Backbone){

// Model representing the entire event
var Event = Backbone.Model.extend({
    urlRoot: '/event',

    initialize: function(){
        this.set('total', this.get('invitees').length);

        this.on('change:times', function(){
            this._setTotal();
        });
        this.trigger('change:times');
    },

    _setTotal: function(){
        var total = this.get('total');
        var times = this.get('times');
        _.each(times, function(time){
            time.total = total;
        });
        this.set('times', times);
    },

    defaults: {
        id: 0,
        name: "New event",

        location: {
            name: "",
            coords: {
                lat: 0,
                lon: 0
            }
        },

        description: "No description provided",

        invitees: [
            {}
        ],

        times: [
            {}
        ]
    }
});

return Event;

});
