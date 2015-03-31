define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone'),
        ContentFactory  = require('views/ContentFactory'),
        History = require('jquery_history');

    require('carouFredSel');

    var viewFactory = new ContentFactory();
    var base_url = window.base_url;
    var assets_url = window.assets_url;

    var PlaylistsView = Backbone.View.extend({
        el: "#main",
        template: '/profile/playlists',
        render: function() {
            var that = this;

            if ($('#content').attr('class') != "profile playlists") {
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
            var hash   = (location.pathname).split("/");
            var language = window.language || {};

            $.get(base_url+'application/www/language/playlists.xml', null, function (data, textStatus) {

                if (textStatus == "success") language = data;

            }, 'xml').done(function(){

                if ($("#albums-carousel").find("li").length > 0) slider.albums();

                $(".music-rating").jRating({
                    rateInfosY : -35,
                    rateMax : 5,
                    step: true,
                    canRateAgain: true,
                    phpPath : base_url+'musics/rate',
                    smallStarsPath: assets_url+'images/icon-fav-star.png'
                });

                $(".select-album").on("click", function(e) {

                    $(".music-list").hide();
                    $(".albums-nav li").removeClass("active");

                    $(this).parent().parent().addClass("active");
                    $("[data-id="+$(this).data("id")+"]").show();

                    History.pushState(null, null, base_url+hash[1]+"/"+hash[2]+"/"+$(this).data("id"));

                    e.preventDefault();
                });

            });

            var slider = {

                'albums' : function() {

                    $('#albums-carousel').carouFredSel({
                        width: '100%',
                        scroll: 1,
                        prev: '#album-prev',
                        next: '#album-next',
                        auto: false,
                        align: 'left',
                        items: {
                            visible: {
                                min: 7
                            }
                        }
                    });

                }

            };
        }

    });

    return PlaylistsView;
});