define(

['jquery', 'backbone', 'layoutmanager', 'jquery-ui'],
function($, Backbone){

var _pad = function(num){
    // Pad a number to two digits if it only has one
    return num < 10 ? '0' + num : num;
};

var _roundUpTime = function(time, roundTo){
    // Round up a number of minutes to the next interval

    // Get the minutes and hours from the Date object passed in
    var minutes = time.getMinutes();
    var hours = time.getHours();

    // Default the number of minutes to round up to to be 15 if it wasn't specified
    roundTo = typeof roundTo === 'undefined' ? 15 : roundTo;

    // Round the minutes
    minutes = Math.ceil(minutes / roundTo) * roundTo;

    // If it's 60 minutes, set it to zero and increase the number of hours instead
    if (minutes === 60){
        minutes = 0;
        hours += 1;
    }

    // Return an object containing the new amount of hours and minutes
    return {
        minutes: minutes,
        hours: hours
    };
};

var _formatTimestring = function(d){
    // Create a string representation of the time part of a date object in the format HH:MM

    // Create a new Date object representing the current time if nothing was passed in
    d = d || new Date();

    var time = _roundUpTime(d);

    var minutes = _pad(time.minutes);
    var hours = _pad(time.hours);

    return hours + ":" + minutes;
};

var Invitee = Backbone.Model.extend({
    defaults: {
        id: 0,
        name: "",
        email: ""
    }
});

var Invitees = Backbone.Collection.extend({
    model: Invitee
});

var PossibleTime = Backbone.Model.extend({
    initialize: function(){
        // Bind relationships between properties of the model
        this.on('change:attendees', function(){
            this._updateAttendeeData();
        });

        this.on('change:date', function(){
            this._updateTime();
        });

        if(this.has('start')){
            this.set('date', new Date(this.get('start')));
        } else {
            this.set('date', new Date());
        }

        // Update the values based on those relationships for the first time
        this.trigger('change:attendees');
        this.trigger('change:date');
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
        var date = this.get('date');
        this.set('timestring', _formatTimestring(date));
        this.set('datestring', $.datepicker.formatDate('dd/mm/yy', date));
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
        // if (attrs.duration <= 0){
        //     return "Duration must be a positive number of minutes";
        // }

        // if (attrs.numAttending <= 0){
        //     return "No one is attending this time!";
        // }

        // if (attrs.date.getTime() < new Date().getTime()){
        //     return "Event cannot happen in the past";
        // }
    },

    defaults: {
        duration: 60,
        numAttending: 0,
        total: 0,

        attendees: [],
        ratio: 0
    }
});

var PossibleTimes = Backbone.Collection.extend({
    url: '/time',
    model: PossibleTime
});

// Reusable classes for the header and footer of each page
var Title = Backbone.Model.extend({
    defaults: {
        page_title: ""
    }
});

var Footer = Backbone.Model.extend({
    defaults: {

    }
});

var TitleView = Backbone.View.extend({
    tagName: 'title',

    model: new Title(),

    initialize: function(){
        var content = '<%= page_title %> - Eventual - Easy Event Planning';
        var compiled = _.template(content);
        var data = this.serialize();
        this.$el.html(compiled(data));
        this.$el.appendTo('head');
    },

    serialize: function(){
        return this.model.toJSON();
    }
});

var HeaderView = Backbone.View.extend({
    tagName: 'header',
    template: 'header',

    events: {
       'click #login-button': 'showLogin'
    },

    showLogin: function(){
        $('#login-wrapper').toggle();
    },

    serialize: function(){
        return this.model.toJSON();
    }
});

var FooterView = Backbone.View.extend({
    tagName: 'footer',
    template: 'footer'
});

var FinishButtonView = Backbone.View.extend({
    template: 'finishbutton',
    tagName: 'form',
    className: 'center',

    events: {
        'click #finish': 'finish'
    },

    finish: function(){
        $('.finish-box').toggle();
    }
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

    Title: Title,
    TitleView: TitleView,

    Expander: Expander,
    HeaderView: HeaderView,
    FooterView: FooterView,

    FinishButtonView: FinishButtonView
};

});
