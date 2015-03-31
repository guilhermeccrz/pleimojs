define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone'),
        GA              = require('gga');

    var base_url = window.base_url;

    var FavoritesView = Backbone.View.extend({
        el: $("body"),

        initialize: function() {
            this.session = arguments[0].session;
        },

        events: {
            "click .favorite": "favoriteClickHandler",
            "click .unfavorite": "unfavoriteClickHandler"
        },

        tryToFavorite: function(element) {
            var $el = $(element);
            var that = this;

            GA.trackEvent('Favorite', 'Click', { 'eventLabel': $el.data('type') + ' [' + $el.data('target') + ']'});

            if (typeof $el.data('req') == 'undefined') {
                $el.addClass("active loading");

                var req = this.session.checkAuth({
                    success: function() {
                        that.favorite($el);
                    },
                    error: function() {
                        that.session.Signin();
                        $el.removeClass("active loading");
                        $el.removeData('disabled');
                    },
                    complete: function() {
                        $el.removeData('req');
                    }
                }, false);

                $el.data('req', req);
            }
        },

        favorite: function(element) {
            var $el = $(element);

            if (typeof $el.data('reqfav') == 'undefined') {
                var req = $.ajax({
                    type: "POST",
                    data:  { type : $el.data("type"), target : $el.data("target")},
                    url: base_url+"xhr/fav"
                }).done(function( data ) {

                        if ( ! data) {
                            $el.removeClass("active");
                            return false;
                        }

                        $el.html( parseInt( $el.html() ) + 1);
                        $el.removeClass("favorite loading").addClass("unfavorite");

                        if ($el.data("type") === 'video')
                        {
                            $('[data-video-id='+$el.data("target")+']').addClass('fav');
                        }
                    }).fail(function(data) {
                        $el.removeClass("active");
                    }).always(function() {
                        $el.removeClass('loading');
                        $el.removeData('reqfav');
                        $el.removeData('disabled');
                    });

                $el.data('reqfav', req);
            }
        },

        tryToUnfavorite: function(element) {
            var $el = $(element);
            var that = this;

            GA.trackEvent('Unfavorite', 'Click', { 'eventLabel': $el.data('type') + ' [' + $el.data('target') + ']'});

            if (typeof $el.data('req') == 'undefined') {
                $el.addClass('loading');

                var req = this.session.checkAuth({
                    success: function() {
                        that.unfavorite($el);
                    },
                    error: function() {
                        that.session.Signin();
                        $el.removeClass("active loading");
                        $el.removeData('disabled');
                    },
                    complete: function() {
                        $el.removeData('req');
                    }
                }, false);

                $el.data('req', req);
            }
        },

        unfavorite: function(element) {
            var $el = $(element);

            if (typeof $el.data('reqfav') == 'undefined') {
                var req = $.ajax({
                    type: "POST",
                    data:  { type : $el.data("type"), target : $el.data("target")},
                    url: base_url+"xhr/unfav"
                }).done(function( data ) {

                        if ( ! data) {
                            return false;
                        }

                        var qty = parseInt($el.html());
                        if (qty > 0) $el.html( qty - 1 );

                        $el.removeClass("active loading");
                        $el.removeClass("unfavorite").addClass("favorite");

                        if ($el.data("type") === 'video')
                        {
                            $('[data-video-id='+$el.data("target")+']').removeClass('fav');
                        }
                    }).always(function() {
                        $el.removeClass('loading');
                        $el.removeData('reqfav');
                        $el.removeData('disabled');
                    });

                $el.data('reqfav', req);
            }
        },

        favoriteClickHandler: function(e) {
            var $el = $(e.target);
            if (typeof $el.data('disabled') == 'undefined') {
                $el.data('disabled', true);
                this.tryToFavorite($el);
            }
        },

        unfavoriteClickHandler: function(e) {
            var $el = $(e.target);
            if (typeof $el.data('disabled') == 'undefined') {
                $el.data('disabled', true);
                this.tryToUnfavorite($el);
            }
        }

    });

    return FavoritesView;
});