define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone'),
        ContentFactory  = require('views/ContentFactory');

    var viewFactory = new ContentFactory();

    var TermsArtistView = Backbone.View.extend({
        el: "#main",
        template: '/terms/artists',
        render: function() {
            var that = this;

            if (!$('#content').hasClass('terms')) {
                viewFactory.loadTemplate(this.template, {
                    success: function(data, status) {
                        that.$el.html(data);
                    },
                    error: function(data, status) {
                        if (status == 404) {
                            that.$el.html(data);
                        }
                    }
                });
            } else {
                $(document).trigger('View.loaded');
            }
        }
    });

    return TermsArtistView;
});