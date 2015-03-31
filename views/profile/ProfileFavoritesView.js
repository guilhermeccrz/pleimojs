// Filename: ProfileFavoritesView.js
define(function(require){
    "use strict";

    var Backbone        = require('backbone'),
        ContentFactory  = require('views/ContentFactory');

    var viewFactory = new ContentFactory();

    var ProfileFavoritesView = Backbone.View.extend({
        el: "#main",
        template: '/profile/favorites',
        render: function(){
            var that = this;


                viewFactory.loadTemplate(this.template, {
                    success: function(data, status) {

                        that.$el.html(data);
                    },
                    error: function(data, status) {
                        if (status == 404) {
                            that.$el.html(data);
                        }
                    }
                },
                {
                    cache: false
                });
        }
    });

    return ProfileFavoritesView;
});