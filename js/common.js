_pad = function(num){
        return num < 10 ? '0' + num : num;
};

Time = {
    now: (function(){
        var d = new Date();
        return _pad(d.getHours()) + ":" + _pad(d.getMinutes());
    }())
};

var PossibleTime = Backbone.Model.extend({
    increment: function(value, amount){
        amount = typeof amount === 'undefined' ? 1 : amount;
        this.set(value, this.get(value) + amount);
    },

    decrement: function(value, amount){
        amount = typeof amount === 'undefined' ? 1 : amount;
        this.increment(value, -amount);
    },

    defaults: {
        start: Time.now,
        duration: 60,
        date: $.datepicker.formatDate('dd/mm/yy', new Date()),
        confirmed: 0,
        total: 1
    }
});

var PossibleTimes = Backbone.Collection.extend({
    model: PossibleTime
});

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
