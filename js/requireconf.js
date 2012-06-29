require.config({
    baseUrl: 'js',
    
    paths: {
        'jquery': 'libs/jquery-1.7.2.min',
        'jquery-ui': 'libs/jquery-ui.min',
        'jquery-ui-timepicker': 'libs/jquery-ui-timepicker',

        'underscore': 'libs/underscore',
        'backbone': 'libs/backbone',
        'layoutmanager': 'libs/backbone.layoutmanager',

        'plugins': 'plugins',
        'common': 'common',

        'piechart': 'models/piechart',
        'event': 'models/event'
    },

    shim: {
        'underscore': {
            exports: '_'
        },

        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },

        'layoutmanager': ['jquery', 'underscore', 'backbone'],

        'jquery-ui': ['jquery'],
        'jquery-ui-timepicker': ['jquery-ui', 'jquery']

    }
});
