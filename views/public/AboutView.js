// Filename: AboutView.js
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
    var AboutView = Backbone.View.extend({
        el: "#main",
        template: '/about',
        aboutDetails: function(){
            viewFactory.createView('aboutDetails');
        },
        render: function() {
            var that = this;

            if (!$('#content').hasClass('about')) {
                viewFactory.loadTemplate(this.template, {
                    success: function(data, status) {
                        that.$el.html(data);
                        that.addEvents();
                    },
                    error: function(data, status) {
                        if (status == 404) {
                            that.$el.html(data);
                        }
                    }
                });
            } else {
                $(document).trigger('View.loaded');
                this.addEvents();
            }
        },
        addEvents: function() {
            $('#more a').on('click', this.aboutDetails);

            $('#map-pins a').click(function(e) {
                var openID = $(this).attr('href');

                if  ($(openID).is(':visible')) {
                    $(openID).fadeOut();
                } else {
                    $('.frame-address').fadeOut();
                    $(openID).fadeIn();
                }

                e.preventDefault();
            });

            /** Close office details */
            $('a.btn-close').click(function(e) {

                $(this).parent().fadeOut();
                e.preventDefault();

            });


        }
}   );

    return AboutView;
});