_pad = function(num){
        return num < 10 ? '0' + num : num;
};

Time = {
    timeNow: (function(){
        var d = new Date();
        return d.getHours() + ":" + _pad(d.getMinutes());
    }()),

    dateNow: (function(){
        var d = new Date();
        return d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear();
    }())
};

var PossibleTime = Backbone.Model.extend({
    defaults: {
        start: Time.timeNow,
        duration: 60,
        date: Time.dateNow,
        confirmed: 0,
        total: 1
    }
});

var PossibleTimes = Backbone.Collection.extend({
    model: PossibleTime
});
