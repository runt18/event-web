_pad = function(num){
        return num < 10 ? '0' + num : num;
};

Time = {
    now: (function(){
        var d = new Date();
        return _pad(d.getHours()) + ":" + _pad(d.getMinutes());
    }())
};

var Event = Backbone.Model.extend({
    defaults: {
        totalAttendees: 10
    }
});

var PossibleTime = Event.extend({
    initialize: function(){
        this._updateRatio();
        this.on('change:confirmed change:total', function(){
            this._updateRatio();
        });
    },
    increment: function(value, amount){
        amount = typeof amount === 'undefined' ? 1 : amount;
        this.set(value, this.get(value) + amount);
    },

    decrement: function(value, amount){
        amount = typeof amount === 'undefined' ? 1 : amount;
        this.increment(value, -amount);
    },

    _updateRatio: function(){
        var oldRatio = this.get('ratio');
        this.set('oldRatio', oldRatio);

        var ratio = this.get('confirmed') / this.get('total');
        this.set('ratio', ratio);
    },

    defaults: {
        start: Time.now,
        duration: 60,
        date: $.datepicker.formatDate('dd/mm/yy', new Date()),
        confirmed: 0,
        ratio: 0,
        total: 10,
        oldRatio: 0,
        attending: false
    }
});

var PossibleTimes = Backbone.Collection.extend({
    model: PossibleTime
});

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

var HeaderView = ReusableView.extend({
    tagName: 'header',
    filename: 'header'
});

var FooterView = ReusableView.extend({
    tagName: 'footer',
    filename: 'footer'
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
