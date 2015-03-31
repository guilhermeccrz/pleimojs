define(function(require){

    "use strict";

    var $                   = require('jquery'),
        Backbone            = require('backbone'),
        ContentFactory      = require('views/ContentFactory'),
        GA                  = require('gga');

    var viewFactory = new ContentFactory();
    var base_url = window.base_url;

    var PlansArtistView = Backbone.View.extend({
        el: '#main',
        template: '/plans/artists',

        initialize: function() {

            $('.btn .subscribe').on('click', this.subscribe);
            $('.big-btn .subscribe').on('click', this.subscribeAll);

        },

        subscribeAll: function(){

            viewFactory.getView('modals/CheckoutView', function(view) {
                view.render('plans');
            });
        },

        subscribe: function(plan) {
            plan = $(this).data("subscribe");

            viewFactory.getView('modals/SubscribeView', function(view) {
                view.render(plan);
            });
        },

        render: function() {
            var that = this;

            if ($('#content').attr('class') != "plans artists") {
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
            var videoID = (window.lang == 'en-US')?'9J6Je8htUiw':'PpaPRZQRWRA';
            $('.video').append("<img class='frameImg' src='http://img.youtube.com/vi/"+videoID+"/hqdefault.jpg' />");
            $('.video .frameImg').show();

            var player;
            window.onYouTubeIframeAPIReady = function() {
                try {
                    var YT = window.YT;
                    player = new YT.Player('ytapiplayer', {
                        height: '100%',
                        width: '100%',
                        videoId: videoID,
                        playerVars: {
                            'loop': 1,
                            'controls': 0,
                            'autohide': 1,
                            'showinfo': 0,
                            'origin' : 'https://pleimo.com',
                            'theme' : 'light',
                            'modestbranding' : 1
                        },
                        events: {
                            'onReady': function(event) {
                                event.target.mute();
                                // event.target.playVideo();


                                $(".player .play-big").on("click", function(){
                                    $('.video .player').hide();
                                    $('.video .frameImg').hide();
                                    player.seekTo(0);
                                    player.unMute();
                                    player.setPlaybackQuality("hd1080");
                                    player.playVideo();

                                    GA.trackEvent('Video', 'Play', { 'page' : Backbone.history.location.pathname, 'eventLabel': 'Plan Artist' });
                                });

                            }

                        }
                    });
                } catch (e) { }
            };

            $.getScript('//www.youtube.com/iframe_api', function() {
                window.onYouTubeIframeAPIReady();
            });

            var language = window.language || {};
            $.get(base_url+'application/www/language/artists.xml', null, function (data, textStatus) {

                if (textStatus == "success") language = data;

            }, 'xml').done(function(){});

        }

    });

    return PlansArtistView;
});