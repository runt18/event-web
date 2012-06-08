//Main view for the entire page
require(

['jquery', 'underscore', 'backbone', 'common', 'layoutmanager', 'jquery-ui', 'plugins'],
function($, _, Backbone, Common){

var main = new Backbone.LayoutManager({
    template: '#main-tmpl',
    id: 'wrapper',

    views: {
        '#header': new Common.HeaderView(),
        '#footer': new Common.FooterView()
    }
});

main.$el.appendTo('body');
main.render();

});
