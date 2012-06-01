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

// App.OptionalExpander = Em.View.extend({
//     expand: function(){
//         $('#optional-expander').toggleClass('down');
//         $('#optional').toggle('fast');
//     }
// });
