define(function(require){
    "use strict";

    var Backbone        = require('backbone'),
        ContentFactory  = require('views/ContentFactory');

    var viewFactory = new ContentFactory();
    var CartProcessView = Backbone.View.extend({
        el: "#main",
        render: function(){
            var that = this;

            var template = location.pathname.substr(1);

            viewFactory.loadTemplate(template, {
                success: function(data) {
                    that.$el.html(data);
                },
                error: function(data, status) {
                    if (status == 404) {
                        that.$el.html(data);
                    }
                }
            }, { cache: false });
        }
    });

    return CartProcessView;
});