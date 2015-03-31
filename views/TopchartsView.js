// Filename: TopchartView.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone'),
        ContentFactory  = require('views/ContentFactory');

    var viewFactory = new ContentFactory();

    var TopchartsView = Backbone.View.extend({
        el: $("#main"),
        template: '/topcharts',
        render: function(){
            var that = this;

            if (!$('#content').hasClass('topcharts')) {
                viewFactory.loadTemplate(this.template, {
                    success: function(data) {
                        that.$el.html(data);
                    },
                    error: function(data, status) {
                        if (status === 404) {
                            that.$el.html(data);
                        }
                    }
                });
            } else {
                $(document).trigger('View.loaded');
            }
        }
    });

    return TopchartsView;
});