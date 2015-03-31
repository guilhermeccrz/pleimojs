define(function(require){
    "use strict";

    var $                   = require('jquery'),
        Backbone            = require('backbone'),
        //PaymentModel        = require('PaymentModel'),
        ContentFactory      = require('views/ContentFactory');


    var viewFactory = new ContentFactory();

    var PlansView = Backbone.View.extend({
        el: '#main',
        template: '/plans',

        initialize: function() {
        },

        render: function(){
            var that = this;

            if ($('#content').attr('class') != "plans") {
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

    return PlansView;
});