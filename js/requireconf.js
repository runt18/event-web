require.config({
    baseUrl: 'js',
    
    paths: {
        'use': 'libs/use',
        'jquery': 'libs/jquery-1.7.2.min',
        'jquery-ui': 'libs/jquery-ui.min',
        'jquery-ui-timepicker': 'libs/jquery-ui-timepicker',

        'underscore': 'libs/underscore',
        'backbone': 'libs/backbone',
        'layoutmanager': 'libs/backbone.layoutmanager',

        'plugins': 'plugins',
        'common': 'common'
    },

    use: {
        "layoutmanager": {
            attach: "LayoutManager",
            deps: ['underscore', 'backbone', 'jquery']
        }

       // "backbone": {
       //      deps: ["use!underscore", "jquery"],
       //      attach: function(_, $) {
       //          return Backbone;
       //      }
       //  }
    }
});
