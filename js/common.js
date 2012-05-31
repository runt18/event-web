var App = Em.Application.create();

App.Time = {
    timeNow: (function(){
        var d = new Date();
        return d.getHours() + ":" + d.getMinutes();
    }()),

    dateNow: (function(){
        var d = new Date();
        return d.getDate() + '/' + d.getMonth() + '/' + d.getYear();
    }())
};

App.OptionalExpander = Em.View.extend({
    expand: function(){
        $('#optional-expander').toggleClass('down');
        $('#optional').toggle('fast');
    }
});
