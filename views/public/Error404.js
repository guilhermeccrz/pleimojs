// Filename: Error404.js
define(function(require){

    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone'),
        ContentFactory  = require('views/ContentFactory');

    var viewFactory = new ContentFactory();

    /**
     * Created by c.uemura on 1/21/14.
     * @author Celina Uemura (c.uemura@pleimo.com)
     * @author Leonardo Moreira <developer@pleimo.com>
     */
    /** Open office details */
    var Error404 = Backbone.View.extend({
        el: "#main",
        template: '/404',
        render: function() {
            var that = this;

            if (!$('#content').hasClass('page404')) {
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

    return Error404;
});