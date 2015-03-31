// Filename: LandingView.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone'),
        imagesLoaded    = require('imagesloaded'),
        ContentFactory  = require('views/ContentFactory');
        require('viewportSize');
        require('jquery_jcarousel');
        require('pleimo_carousel');

    var pleimo = window.pleimo || {};
    var viewFactory = new ContentFactory();

    /**
     * Landing Page
     * @author Celina Uemura <cezinha@cezinha.com.br>
     **/
    pleimo.Landing = {

        w: 1050,
        h: 440,
        slidew: 900,

        init: function() {

            this.setCarouSize();

            /* init pleimocarousel (Playing) */
            var $playing = $("#playing");
            if ($playing && $playing.length > 0)
                $("#playing").pleimocarousel();

            /* top carousel */
            var jcarousel = $('.jcarousel');

            if (jcarousel && jcarousel.length > 0) {
                var imgLoad = imagesLoaded('.jcarousel');
                imgLoad.on('always', function(instance) {
                    $('section#content').addClass('landing');
                });
                imgLoad.on('done', function(instance) {
                    if (jcarousel && jcarousel.length > 0) {
                        jcarousel.on('jcarousel:reload jcarousel:create', function() {
                            var width = window.viewportSize.getWidth();

                            jcarousel.jcarousel('items').css('width', width + 'px');
                            jcarousel.find('>ul>li').css({'float': 'left'});
                            var len = jcarousel.find('>ul>li').length;
                            jcarousel.find('>ul').css('width', len*width);
                        });
                        jcarousel.jcarousel({
                            wrap: 'circular'
                        })
                        .jcarouselAutoscroll({
                            interval: 5000,
                            target: '+=1',
                            autostart: true
                        }).hover(function() {
                                $(this).jcarouselAutoscroll('stop');
                            },
                            function() {
                                $(this).jcarouselAutoscroll('start');
                            });

                        $('.jcarousel-pagination')
                            .on('jcarouselpagination:active', 'a', function() {
                                $(this).addClass('active');
                            })
                            .on('jcarouselpagination:inactive', 'a', function() {
                                $(this).removeClass('active');
                            })
                            .jcarouselPagination({
                                perPage: 1,
                                item: function(page) {
                                    return '<a href="javascript:void(0);">' + page + '</a>';
                                }
                            });

                       /* setTimeout(function() {
                           jcarousel.jcarousel('scroll', '+=1');
                        }, 3000);*/
                    }
                });
                //imgLoad.on('fail', function() {

                //});
                /*imgLoad.on('progress', function(instance, image) {
                    var result = image.isLoaded ? 'loaded' : 'broken';
                });*/
            }

            var $win = $(window);

            $win
                .on('resize.landing', function() {
                    pleimo.Landing.resize();
                })
                .trigger('resize.landing')
                .on('unload.landing', function() {
                    var jcarousel = $('.jcarousel');

                    if (jcarousel && jcarousel.length > 0)
                        jcarousel.jcarouselAutoscroll('destroy');

                    $win.off('.landing');
                });
        },
        resize: function() {
            this.setCarouSize();

            var $playing = $("#playing");
            $playing.width(this.w + 'px');
            $playing.parent().width(this.w + 'px');
        },

        /**
         * @method set parameters for responsive carousel
         */
        setCarouSize: function() {

            this.w = 1050;
            this.h = 440;
            this.slidew = 900;
            if (window.viewportSize.getWidth() <= 800) {

                this.w = 720;
                this.slidew = 650;

                if (window.viewportSize.getWidth() <= 400) {
                    this.w = 160;
                    this.h = 360;
                    this.slidew = 300;
                }

            }
        }
    };

    window.pleimo = pleimo;

    var LandingView = Backbone.View.extend({
        el: "#main",
        template: '/home',
        render: function() {
            var that = this;

            if (!$('#content').hasClass('landing')) {
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
            pleimo.Landing.init();
        }
    });

    return LandingView;
});