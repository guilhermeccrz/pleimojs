define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone'),
        ContentFactory  = require('views/ContentFactory'),
        ShareView       = require('views/ui/ShareView'),
       // PlaylistView    = require('views/ui/PlaylistView'),
        GA              = require('gga');


    require('swfobject');
    require('carouFredSel');

    var pleimo = window.pleimo || {};
    var viewFactory = new ContentFactory();
    var ytplayer;
    var base_url = window.base_url;
    var assets_url = window.assets_url;

    var ArtistPageView = Backbone.View.extend({
        el: '#main',
        initialize: function(){
            this.shareView = new ShareView();
           // this.playlistView = new PlaylistView();
        },
        render: function() {

            var that = this;

            var uri = location.pathname.substr(1);
            uri = (uri.indexOf('/') === 0) ? uri.substr(1) : uri.split('?')[0];
            uri = (uri.indexOf('?') == -1) ? uri : uri.split('?')[0];

            if (!$('#content').hasClass(uri)) {
                viewFactory.loadTemplate(uri, {
                    success: function(data, status) {
                        that.$el.html(data);

                        if ($('#content').hasClass('artist')) {
                            that.addEvents();
                            that.shareView.render();
                           // that.playlistView.render();

                        }
                    },
                    error: function(data, status) {
                        if (status == 404) {
                            that.$el.html(data);
                        }
                    }
                }, {cache: false});
            } else {
                $(document).trigger('View.loaded');
                if ($('#content').hasClass('artist')) {
                    that.addEvents();
                    that.shareView.render();
                   // that.playlistView.render();
                 
                }
            }
        },



        addEvents: function() {
            /*CHECK PRODUCT REQUEST BY URL TOKEN PARAMETER*/

            var requestToken = location.pathname.substr(1);
            requestToken = requestToken.split('product/');
            requestToken = requestToken[1];


            $('.products-list ul li').each(function(){

                var token = $(this).attr('data-token');
                var dataId = $(this).attr('data-id');

                if(requestToken == token){

                    var viewFactory = new ContentFactory();
                    viewFactory.getView("artist/ProductsView", function(view) {
                        view.render(dataId);
                    });

                }

            });

            /*DEFAULT VARS */

            var tab    = null;
            var hash   = (location.pathname).split("/");
            var params = { allowScriptAccess : 'always', wmode : 'opaque' };
            var atts   = { id : 'myytplayer'};

            var videos = window.videos;

            if (videos && videos.length > 0)
                window.swfobject.embedSWF("https://www.youtube.com/v/"+videos[0]['API_ID']+"?enablejsapi=1&playerapiid=ytplayer&version=3&autohide=1&controls=1&modestbranding=1&showinfo=0&iv_load_policy=3", "ytapiplayer", "100%", "550", "8", null, null, params, atts);

            /*LANGUAGE XML CALL*/
            var language = window.language || {};

            $.get(base_url+'application/www/language/artists.xml', null, function (data, textStatus) {


                if (textStatus == "success") language = data;

            }, 'xml').done(function(){


                /*TABS TOGGLE*/
                $("#content").addClass('artist');

                // if ($("#similar-carousel").length > 0) slider.similar();
                if ($("#albums-carousel").find("li").length > 0) slider.albums();
                if ($(".products-list").find("li").length > 0) slider.products();

                $("section.products-list ul li").on("click", function(){
                    var token = $(this).attr('data-token');
                    var dataId = $(this).attr('data-id');

                    pleimo.Session.checkAuth({
                        success: function() {

                           // products.Details();

                            var viewFactory = new ContentFactory();
                            viewFactory.getView("artist/ProductsView", function(view) {
                                view.render(dataId);
                            });

                            var artist = Backbone.history.location.pathname.split('/')[1];
                            Backbone.history.navigate('/' + artist + '/product/' + token, { trigger: false, replace: true });
                            GA.pageView();

                        },

                        error: function(){


                            viewFactory.getView('modals/SignInView', function(view){
                                view.render('','',token);

                            });
                        }

                    });
                });

                /*VIDEOS PLAYER*/
                if (videos && videos.length > 0)
                {
                    slider.video();
                    onYouTubePlayerReady("myytplayer");
                }

                if ((hash[2] !== "bio" && hash[2] !== "video") && hash[3])
                {
                    $(".music-list").hide();
                    $(".albums-nav li").removeClass("active");

                    $("[data-id="+hash[2]+"]").parents('li').addClass("active");
                    $("[data-id="+hash[2]+"]").show();

                    $('#albums-carousel').trigger('slideTo', $('#albums-carousel li.active'));
                }

                if (hash[2] === "bio")
                {
                    tab = "bio-tab";

                    $("#tabs li").removeClass('active');
                    $("."+tab).parent().addClass("active");

                    $(".tab").hide();
                    $("#"+tab).fadeIn(100);

                    slider.photo();

                    ($(document).find(".artist.intro").length > 0) ? $(document).scrollTop("520") : $(document).scrollTop("90");
                }

                if (hash[2] === "product")
                {
                    $('[data-token='+hash[3]+']').trigger("click");
                }

                /*PHOTO CAROUSEL TRIGGER*/
                $("#photos-carousel img").on("click", function(){
                    GA.trackEvent('Gallery', 'Click', { 'page': Backbone.history.location.pathname, 'eventLabel': $(this).data('image') });

                    var picture = $(this).data('image');
                    var caption = $(this).data('caption');

                    $(".photo-full img").attr('src', picture);

                    $(".photo-full img").one('load', function() {
                        $(this).fadeTo(100, 0.5).fadeTo(100, 1.0);
                        $(".photo-full figcaption").html(caption);
                    });

                    $("#photos-carousel").find(".active").removeClass();

                    $(this).closest("li").addClass("active");

                    $(".photo-full .flag").data('picture', $(this).data('picture'));

                    //($(document).find(".artist.intro").length > 0) ? $(document).scrollTop("720") : $(document).scrollTop("290");

                });



                /*TABS TOOGLE TRIGGER*/
                $("#tabs li a").on("click", function(e) {
                    e.preventDefault();

                    var target = hash[1];

                    tab = $(this).data("tab");

                    $("#tabs li").removeClass('active');
                    $("."+tab).parent().addClass("active");

                    $(".tab").hide();
                    $("#"+tab).fadeIn(100);

                    if (tab == "bio-tab") {
                        slider.photo();
                        target = target+"/bio";
                    }

                    GA.trackEvent('Artist', 'Tab', { 'page' : target });

                    Backbone.history.navigate(target, false);
                });

                $(".select-album").on("click", function(e) {
                    e.preventDefault();

                    GA.trackEvent('Album', 'Select', { 'page' : Backbone.history.location.pathname, 'eventLabel': $(e.currentTarget).data('id') + ' [' + $(e.currentTarget).data('album') + ']'});

                    $(".music-list").hide();
                    $(".albums-nav li").removeClass("active");

                    $(this).parent().parent().addClass("active");
                    $("[data-album="+$(this).data("album")+"]").show();

                    var url = "/"+hash[1]+"/"+$(this).data("id")+"/"+$(this).data("album");
                    Backbone.history.navigate(url, false);
                });

                $(document).ready(function(){
                    if (hash[2] == 'video'){
                        setTimeout(function()
                            { youtube.play(); }
                            , 500);
                    }
                });

                $(".player .play-big").on("click", function(){
                    youtube.play();
                });

                $(".play-queue").on("click", function(){
                    var $this = $(this);
                    GA.trackEvent('Video', 'Select', { 'page' : Backbone.history.location.pathname, 'eventLabel': $this.data('video') + ' [' + $this.attr('title') + ']'});
                    youtube.load($this.data('object'), $this.data('video'));
                });

                $(".music-rating").jRating({
                    rateInfosY : -35,
                    rateMax : 5,
                    step: true,
                    canRateAgain: true,
                    phpPath : base_url+'musics/rate',
                    smallStarsPath: assets_url+'images/icon-fav-star.png'
                });

            });

            var youtube = {

                'play' : function() {

                    if (ytplayer) {
                        $(".videos .player").hide();

                        $('body, html').animate({
                            scrollTop: $("section.videos").offset().top
                        }, 200);

                        ytplayer.setPlaybackQuality("hd1080");
                        ytplayer.playVideo();

                        var ytsrc = $("#myytplayer").attr('data');
                        GA.trackEvent('Video', 'Play', { 'page' : Backbone.history.location.pathname, 'eventLabel': ytsrc + ' [' + $('section.videos h4').text() + ']' });

                        if (($("#jplayer").length > 0) && ($("#jplayer").data("jPlayer").status.currentTime>0) && ($("#jplayer").data("jPlayer").status.paused===false)) {
                            $(".jp-pause").trigger('click');
                        }
                    }

                },

                'load' : function(object, video) {

                    if (ytplayer) {

                        if ((videos[object]['TITLE']).length > 65) videos[object]['TITLE'] = videos[object]['TITLE'].substr(0, 65)+"...";

                        $(".videos .title").html(videos[object]['TITLE']);

                        $('li.grid_1').find('[data-target]').remove();

                        var classes;
                        if ($(document).find("[data-video='"+videos[object]['API_ID']+"']").hasClass('fav')) {
                            classes = ' active unfavorite ';
                        } else {
                            classes = ' favorite ';
                        }

                        $('li.grid_1').first().append('<a href="javascript:void(0);" class="heart'+classes+'" data-type="video" data-target="'+videos[object]['ID_VIDEO']+'"></a>');

                        $('li.grid_1').find('[data-video]').data('permalink', hash[1]+'/video/'+video);

                        $(".videos .player").show().remove("span.pleimo");
                        ytplayer.cueVideoById(video);

                        youtube.play();
                    }

                }

            };

            var slider = {

                'photo' : function() {
                    var $el = $('#photos-carousel');
                    if ($el && $el.length > 0)
                        $el.carouFredSel({
                            width: '520px',
                            scroll: 1,
                            prev: '#photos-prev',
                            next: '#photos-next',
                            auto: false,
                            items: {
                                visible: {
                                    min: 5
                                }
                            }
                        });
                },

                'albums' : function() {
                    var $el = $('#albums-carousel');
                    if ($el && $el.length > 0)
                        $el.carouFredSel({
                            width: '100%',
                            scroll: 1,
                            prev: '#album-prev',
                            next: '#album-next',
                            align: 'left',
                            auto: false,
                            items: {
                                visible: {
                                    min: 8
                                }
                            }
                        });
                },

                'products' : function() {
                    var $el = $('.products-list ul');
                    if ($el && $el.length > 0)
                        $el.carouFredSel({
                            width  : '1000px',
                            scroll : 1,
                            prev   : '#product-prev',
                            next   : '#product-next',
                            auto   : false,
                            align  : 'left',
                            items  : {
                                visible: {
                                    min : 5
                                }
                            }
                        });
                },

                /*'similar' : function() {
                    var $el = $('#similar-carousel');
                    if ($el && $el.length > 0)
                        $el.carouFredSel({
                            width: '100%',
                            scroll: 1,
                            prev: '#similar-prev',
                            next: '#similar-next',
                            auto: false,
                            items: {
                                visible: {
                                    min: 5
                                }
                            }
                        });
                },*/

                'video' : function() {
                    var $el = $('#video-carousel');
                    if ($el && $el.length > 0)
                        $el.carouFredSel({
                            width: '100%',
                            scroll: 1,
                            prev: '#video-prev',
                            next: '#video-next',
                            auto: false,
                            items: {
                                visible: {
                                    min: 8
                                }
                            }
                        });
                }

            };

          /*  var products = {
                "Details" : function(product) {

                    var viewFactory = new ContentFactory();
                    viewFactory.getView("artist/ProductsView", function(view) {
                        view.render(product);
                    });

                }
            };*/

            function onYouTubePlayerReady(playerId) {
                ytplayer = document.getElementById(playerId);
            }

            /*function getParameterByName(name) {
                name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                    results = regex.exec(location.search);
                return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
            }*/

            // hide artist content
            if ($('#bio-tab').text().trim().length < 10) $('nav.artist.nav').hide();
        }

    });

    return ArtistPageView;
});
