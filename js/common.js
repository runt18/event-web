define(

['jquery', 'backbone', 'jquery-ui'],
function($, Backbone){

var _pad = function(num){
    return num < 10 ? '0' + num : num;
};

var Timestring = function(d){
    d = d || new Date();
    return _pad(d.getHours()) + ":" + _pad(d.getMinutes());
};

// Model representing the entire event
var Event = Backbone.Model.extend({
    defaults: {
        total: 10
    }
});

var PossibleTime = Backbone.Model.extend({
    urlRoot: '/event',

    initialize: function(){
        this.set('total', this.get('_event').get('total'));

        // Bind relationships between properties of the model
        this.on('change:attendees', function(){
            this._updateAttendeeData();
        });

        this.on('change:timestamp', function(){
            this._updateTime();
        });

        // Update the values based on those relationships for the first time
        this.trigger('change:attendees');
        this.trigger('change:timestamp');
    },

    increment: function(value, amount){
        amount = typeof amount === 'undefined' ? 1 : amount;
        this.set(value, this.get(value) + amount);
    },

    decrement: function(value, amount){
        amount = typeof amount === 'undefined' ? 1 : amount;
        this.increment(value, -amount);
    },

    _updateTime: function(){
        var date = new Date();
        date.setTime(this.get('timestamp'));
        this.set('start', Timestring(date));
        this.set('date', $.datepicker.formatDate('dd/mm/yy', date));
    },

    _updateAttendeeData: function(){
        this.set('numAttending', this.get('attendees').length);
        this.set('isAttending', this.get('attendees').indexOf('you') !== -1);

        var oldRatio = this.get('ratio');
        this.set('oldRatio', oldRatio);

        var ratio = this.get('numAttending') / this.get('total');
        this.set('ratio', ratio);
    },

    validate: function(attrs){
        if (attrs.duration <= 0){
            return "Duration must be a positive number of minutes";
        }

        if (attrs.numAttending === 0){
            return "No one is attending this time!";
        }

        if (attrs.timestamp < new Date().getTime()){
            return "Event cannot happen in the past";
        }
    },

    defaults: {
        _event: new Event(),

        timestamp: new Date().getTime(),
        start: '',
        date: '',
        duration: 60,

        attendees: [],
        ratio: 0
    }
});

var PossibleTimes = Backbone.Collection.extend({
    model: PossibleTime,
    url: '/event'
});

// Generic class for any view that exists in more than one place
var ReusableView = Backbone.View.extend({
    render: function(manage) {
        return manage(this).render().then(function(el){
            var path = 'templates/' + this.filename + '.html';
            $.get(path, function(content){
                $(el).html(content);
            });
        });
    }
});

// Reusable classes for the header and footer of each page
var HeaderView = ReusableView.extend({
    tagName: 'header',
    filename: 'header'
});

var FooterView = ReusableView.extend({
    tagName: 'footer',
    filename: 'footer'
});

// Class for a UI element that is used to show and hide a view
var Expander = Backbone.View.extend({
    tagName: 'div',
    className: 'expander',

    events: {
        'click': 'expand'
    },

    spinArrow: function(){
        this.$el.toggleClass('expander-closed');
    }
});

// Return everything that's needed outside of this module
return {
    PossibleTime: PossibleTime,
    PossibleTimes: PossibleTimes,
    Expander: Expander,
    HeaderView: HeaderView,
    FooterView: FooterView
};

});
