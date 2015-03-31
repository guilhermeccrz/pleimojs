// Filename: template.js
define(function(require){

    "use strict";

    var $               = require('jquery'),
        GA              = require('gga');
        require('jplayer');
        require('playlist');
        require('bootstrap');
        require('tooltip');
        require('popover');
        require('jquery_history');
        require('jquery_ui');
        require('jquery_mask');
        require('jrating');
        require('swfobject');
        require('livequery');


    var scroll = null;
    var state = null;
    var language = null;
    var template = null;
    var errors = false;
    var allPanels = null;
    var mylist = null;
    //var History = window.History || {};
    var _gaq = window._gaq || [];

    //console.log('template view success');

    var openMask = function() {

        scroll = $(document).scrollTop();

        $("#mask").show();
        $(document).scrollTop(0);

    };
    window.openMask = openMask;

    var closeMask = function() {

        $("#mask").hide();
        $(document).scrollTop(scroll);

        scroll = null;
        errors = false;

        var $zc = $('.zoomContainer');
        if ($zc.length > 0) {
            $zc.remove(); // remove zoom container from DOM
        }

        $(".blackbox, .outbox").remove();

    };
    window.closeMask = closeMask;

    $('#mask').height($(document).height());

    /**
     * @author Leonardo Moreira <developer@pleimo.com>
     * @type {{Signin: Function}}
     */
    /*var actions = {

        "Signin": function(state) {
            if  ( (window.location.search.indexOf("signin") > 0) &&
                    (pleimo.Session && (!pleimo.Session.get('logged_in'))) ) {
                load.Signin(state);
            }
        }

    };*/


    // $(function() {

        /**
         * @author Leonardo Moreira <developer@pleimo.com>
         * @type {{Controller: Function, Signin: Function, Signup: Function, Forgot: Function, userTerms: Function, Logout: Function}}
         */
        var load;
        //var uri = null;
        var req = null;
        var form = null;
        var shuffle = null;
        //var object = null;
        var player = "#jplayer";
        var home = "home";
        var e404 = "404";
        var method = "post";
        var enctype = null;
        var History = window.History || {};
        var pleimo = window.pleimo || {};
        var base_url = window.base_url || '';
        var assets_url = window.assets_url || '';

        //pleimo.Session = pleimo.Session || {};
        //console.log('Session init');
        //console.log(pleimo.Session);
        pleimo.Language = language;

        $.get(base_url + 'application/www/language/template.xml', null, function(data, textStatus) {
            if (textStatus === "success") template = data;
        }, 'xml');

        //$(document)[0].oncontextmenu = function() { return false; }
        $.ajaxSetup({
            cache: true
        });

        /**
         * Bind a handler for ALL hash/state changes.
         * Call actions.Signin and check if need to show signin modal.
         *
         * @author Leonardo Moreira <developer@pleimo.com>
         * @see actions.Signin
         */
        /*History.Adapter.bind(window, 'statechange', function() {
            state = History.getState();
            actions.Signin(state);
        });*/

        /**
         * Create event to make history works.
         *
         * @author Leonardo Moreira <developer@pleimo.com>
         * @see load.Controller
         */
        /*window.addEventListener('popstate', function() {
            load.Controller(location.pathname);
        });*/

        /**
         * Call actions.Signin on document ready and check if need to show signin modal.
         *
         * @author Leonardo Moreira <developer@pleimo.com>
         * @see actions.Signin
         */
        /*$(document).ready(function() {
            actions.Signin();
        });*/
/*
        $(document).on("click", ".load", function(e) {

            e.stopPropagation();
            e.preventDefault();

            if ($(this).data("method")) method = $(this).data("method");
            if ($(this).data("form")) form = $("#" + $(this).data("form")).serialize();
            if ($(this).data("enctype")) enctype = $(this).data("enctype");

            History.pushState(null, null, base_url + $(this).data("href"));
            load.Controller($(this).data("href"));

        });*/

        $(window).bind('beforeunload', function() {
            var $jplayer = $("#jplayer");
            if ($jplayer && $jplayer.length > 0)
                if ($jplayer.data("jPlayer").status.currentTime > 0 && $jplayer.data("jPlayer").status.paused === false) {
                    return 'Se você sair desta página, sua música irá parar de tocar.';
                }
        });

       /* $("body").tooltip({
            selector: '[data-title]',
            title: $(this).data('title')
        });*/

        $(document).on('mouseleave', '.popover', function() {
            $('.popover').hide();
        });

        $(document).on("click", "#mask, .round-button.close, a.btn-close", function() {
            closeMask();
        });

        /**
         * Show the popover for select language
         *
         * @author Celina Uemura <c.uemura@pleimo.com>
         * @author Renato Biancalana da Silva <r.silva@pleimo.com>
         */
        $(document).on("click", "[data-popover=language]", function(e) {
            var html = '<ul class="language">';
            (lang.substr(3, 2).toLowerCase() == "us") ? html += '<li class="us selected"><a href="' + base_url + 'languages/set/us">English <i></i></a></li>' : html += '<li class="us"><a href="' + base_url + 'languages/set/us">English <i></i></a></li>';
            (lang.substr(3, 2).toLowerCase() == "br") ? html += '<li class="br selected"><a href="' + base_url + 'languages/set/br">Português (Brasil)<i></i></a></li>' : html += '<li class="br"><a href="' + base_url + 'languages/set/br">Português (Brasil)<i></i></a></li>';
            (lang.substr(3, 2).toLowerCase() == "pt") ? html += '<li class="pt selected"><a href="' + base_url + 'languages/set/pt">Português (Portugal)<i></i></a></li>' : html += '<li class="pt"><a href="' + base_url + 'languages/set/pt">Português (Portugal)<i></i></a></li>';
            html += '</ul>';

            $(".popover").remove();

            var object = $(e.target);
            var orientation = $(this).data('orientation');

            object.popover({
                selector: $('#footer-language'),
                html: true,
                trigger: 'manual',
                content: html,
                container: '#footer-language',
                placement: 'top'
            });

            object.popover("show");
            e.preventDefault();

        });

        /*Selectbox*/

        $(".dropdown-toggle").mouseenter(function() {
            $(this).siblings().show();
        }).mouseleave(function() {
            $(this).siblings().hide();
        });

        $(".dropdown").mouseenter(function() {
            $(this).show();
        }).mouseleave(function() {
            $(this).hide();
        });

        $(".dropdown li a").click(function() {
            $(".dropdown").hide();
        });


        $("body").on("click", ".form-select .active", function(e) {
            e.stopPropagation();

            //tiping
            /*$(this).keypress(function(event){
                var findLetter = String.fromCharCode(event.which);
            });*/

            var $next = $(this).next();
            if ($next.css('display') == 'block') {
                $next.hide();
            } else {
                $next.show();
            }
        });

        $('.form-select a').each(function() {
            var target = $(this).data('target');

            if ($("#" + target).is(":disabled")) {
                $(this).removeClass("active").addClass("disabled");
            }
        });


        $("body").click(function() {
            $(".dropdown").hide();
        });

        $("body").on("click", ".form-select .dropdown li a", function() {

            var $value = $(this).data("id");

            $(".form-select .dropdown").hide();

            if ($(this).data("value"))
                $value = $(this).data("value");

            $("#" + $(this).data("target")).val($value);
            $(this).parent().parent().siblings().html($(this).html() + " <i class='select-arrow'></i>").removeClass('error');
            $("body").trigger($(this).data("target") + '-dropdown-changed', [$(this).data("id")]);
            $('.submit.filter').trigger('click');

        });

        $("body").on("click", ".accordion dt a", function() {
            var isVisible = $(this).parent().next().is(":visible");
            allPanels.slideUp();

            if (!isVisible) $(this).parent().next().slideDown();
        });

        /** player */
        $(player).jPlayer({
            swfPath: base_url + "templates/pleimo/javascript/libs/",
            supplied: "mp3",
            wmode: "window",
            smoothPlayBar: false,
            ended: function() {
                log.music(mylist.playlist[current].id_music, $(this).data("jPlayer").status.currentTime, mylist.playlist[current].id_artist, mylist.playlist[current].id_album);
            },
            volumeBar: '.jp-volume-bar',
            volumeBarValue: '.jp-volume-bar-value'
            //volumeMax: '.jp-volume-max'
        });

    $(".jp-max-drag").slider({

        value: 80,

        change: function (event, ui) {
            if(ui.value !== 0){
                $(".jp-volume-max0").removeClass('active');
            } else{
                $(".jp-volume-max0").addClass('active');
            }

            var volume = ui.value / 100;
            $(player).jPlayer("volume", volume);
        }
    });

    $(".jp-volume-max0").off().on("click",function(){
        var attrClass = $(this).attr('class');

        if(attrClass == 'jp-volume-max0'){
            $(this).addClass('active');
            $("#jplayer").jPlayer("volume", 0);
            $(".jp-max-drag").slider({value: 0});
        } else{
            $(this).removeClass('active');
            $("#jplayer").jPlayer("volume", 1);
            $(".jp-max-drag").slider({value: 100});
        }
    });

        /** create playlist */
        mylist = new jPlayerPlaylist({
            jPlayer: player
        });

        var music = null;
        var album = null;
        var list = null;
        var radio = null;
        var current = 0;
        var total = (mylist.playlist).length;

        /** get music and play */
        $("body").delegate(".action-play", "click", function(e) {
            e.preventBubble = true;

            if (!pleimo.Session.get('logged_in')) {
                load.Signin();
                return false;
            }

            music = null;
            album = null;
            list = null;
            radio = null;

            var object = $(this);

            //if (!pleimo.Session) return false;

            if ($(object).data("music")) music = $(this).data("music");
            if ($(object).data("album")) album = $(this).data("album");
            if ($(object).data("playlist")) list = $(this).data("playlist");
            if ($(object).data("radio")) radio = $(this).data("radio");

            /* remove all itens from list */
            total = 0;

            // GA - play track
            var GAdata = $(e.currentTarget).data('music') + ' [' + $(e.currentTarget).attr('title') + ']';
            if ($(this).data("album")) {
                GAdata = $(e.currentTarget).data('album') + ' [Album: ' + $(e.currentTarget).attr('title')+ ']';
                if ($(this).data("music")) {
                    GAdata =  $(e.currentTarget).data('music') + ' [Music: ' + $(e.currentTarget).attr('title')+ '] [Album: ' + $(e.currentTarget).data('album') + ']'
                }
            }
            if ($(this).data("playlist")) {
                GAdata = $(e.currentTarget).data('playlist') + ' [Playlist]';
            }
            if ($(this).data("radio")) {
                GAdata = $(e.currentTarget).data('radio') + ' [Radio: ' + $(e.currentTarget).parents('.artist-box').find('h5').text() + ']';
            }
            GA.trackEvent('Track', 'Play', { 'eventLabel': GAdata });
            // END GA

            if (music || album || list || radio) {

                /** playlist */
                if (list !== null) {
                    mylist.remove();
                }

                $(".player .favorite").children().removeClass("active");

                $.ajax({
                    type: "POST",
                    url: base_url + "xhr/player",
                    data: {
                        music: music,
                        album: album,
                        list: list,
                        radio: radio
                    }
                }).done(function(data) {

                    data = $.parseJSON(data);

                    for (var i = 0; i < data.length; i++) {

                        if (!data[i].fav) data[i].fav = false;
                        mylist.add({
                            id_artist: data[i].id_artist,
                            id_album: data[i].id_album,
                            id_music: data[i].id_music,
                            title: data[i].title,
                            artist: data[i].artist,
                            album: data[i].album,
                            permalink: data[i].permalink,
                            href: data[i].href,
                            mp3: data[i].file,
                            poster: data[i].poster,
                            rate: data[i].rate.mean,
                            length: data[i].length,
                            fav: data[i].fav
                        });

                    }

                    shuffle = mylist.playlist;
                    total = (mylist.playlist).length;

                    current = (total > 1) ? (mylist.playlist).length - data.length : current;

                    if (music && album) {
                        $.grep(mylist.playlist, function(obj, key) {
                            if (obj.id_music == music) {
                                current = key;
                            }
                        });
                    }

                    $("#jplayer").jPlayer("setMedia", mylist.playlist[current]);
                    var $player = $(".player");
                    $player.find(".album-photo img").attr("src", mylist.playlist[current].poster).wrap("<a href=\"" + base_url + mylist.playlist[current].href + "\" class=\"load\" data-href=\"" + mylist.playlist[current].href + "\" />").fadeTo(50, 0.9).fadeTo(50, 1.0);
                    $player.find(".player-title").html(mylist.playlist[current].title + " - " + mylist.playlist[current].artist);
                    $player.find(".heart").attr('data-target', mylist.playlist[current].id_music);

                    $player.find(".music-player-rating").attr('data-average', mylist.playlist[current].rate);
                    $player.find(".music-player-rating").attr('data-id', mylist.playlist[current].id_music);

                    mylist.select(current);

                    $(".jp-play").trigger("click");

                    if (list !== null) $(object).find("figure").remove();

                });
            }

        });

        $("body").on("click", ".select-song", function() {
            mylist.play($(this).data('song'));
            current = mylist.current;

            var track = mylist.playlist[$(this).data('song')];
            console.log(track);
            GA.trackEvent('Playlist', 'Play', { 'eventLabel': track.id_music + ' [Playlist Play: ' + track.artist + ' - ' + track.title + ']' });

            $(".jp-play").click();
            $(".popover").remove();
        });

        /** change data for album playlist */
        $(".jp-previous").on("click", function(e) {
            current = mylist.current;

            if (current !== 0) log.music(mylist.playlist[current].id_music, $("#jplayer").data("jPlayer").status.currentTime, mylist.playlist[current].id_artist, mylist.playlist[current].id_album);

            var $player = $(".player");
            $player.find(".album-photo img").attr("src", mylist.playlist[current].poster).wrap("<a href=\"" + base_url + mylist.playlist[current].href + "\" class=\"load\" data-href=\"" + mylist.playlist[current].href + "\" />").fadeTo(50, 0.9).fadeTo(50, 1.0);
            $player.find(".player-title").html(mylist.playlist[current].title + " - " + mylist.playlist[current].artist);
            $player.find(".heart").attr('data-target', mylist.playlist[current].id_music);
            $player.find(".music-player-rating").attr('data-average', mylist.playlist[current].rate);
            $player.find(".music-player-rating").attr('data-id', mylist.playlist[current].id_music);

            if (!mylist.playlist[current].fav) {
                $(".player .heart").addClass("favorite").removeClass("active unfavorite");
            } else {
                $(".player .heart").addClass("active unfavorite").removeClass("favorite");
            }

            e.preventDefault();

        });

        $(".jp-next").click(function(e) {

            current = mylist.current;

            if (current !== 0) log.music(mylist.playlist[current].id_music, $("#jplayer").data("jPlayer").status.currentTime, mylist.playlist[current].id_artist, mylist.playlist[current].id_album);

            var $player = $(".player");
            $player.find(".album-photo img").attr("src", mylist.playlist[current].poster).wrap("<a href=\"" + base_url + mylist.playlist[current].href + "\" class=\"load\" data-href=\"" + mylist.playlist[current].href + "\" />").fadeTo(50, 0.9).fadeTo(50, 1.0);
            $player.find(".player-title").html(mylist.playlist[current].title + " - " + mylist.playlist[current].artist);
            $player.find(".heart").attr('data-target', mylist.playlist[current].id_music);
            $player.find(".music-player-rating").attr('data-average', mylist.playlist[current].rate);
            $player.find(".music-player-rating").attr('data-id', mylist.playlist[current].id_music);

            if (!mylist.playlist[current].fav) {
                $player.find(".heart").addClass("favorite").removeClass("active unfavorite");
            } else {
                $player.find(".heart").addClass("active unfavorite").removeClass("favorite");
            }

            e.preventDefault();

        });

    var addEvent = (function () {
        if (document.addEventListener) {
            return function (el, type, fn) {
                if (el && el.nodeName || el === window) {
                    el.addEventListener(type, fn, false);
                } else if (el && el.length) {
                    for (var i = 0; i < el.length; i++) {
                        addEvent(el[i], type, fn);
                    }
                }
            };
        } else {
            return function (el, type, fn) {
                if (el && el.nodeName || el === window) {
                    el.attachEvent('on' + type, function () { return fn.call(el, window.event); });
                } else if (el && el.length) {
                    for (var i = 0; i < el.length; i++) {
                        addEvent(el[i], type, fn);
                    }
                }
            };
        }
    })();

    var playStorage;

    addEvent(window, 'storage', function (event) {

        if (event.key == 'player') {
            var status = event.newValue;

           // console.log('listeneter '+status);

            if(status == 'playing'){

                if($(".jp-pause").is(':visible')){

                    $(".jp-pause").click();

                }

            }

            localStorage.removeItem('player');

            playStorage = status;

        }
    });

   var dataPlay = document.getElementById("playerPlay");




        /** actions to play music */
        $(".jp-play").on("click", function(e) {

           // addEvent(dataPlay, 'click', function () {
                //set localstorage key

           var storageStatus =  localStorage.getItem('player');
           // console.log(storageStatus);
            if(storageStatus == null){

                localStorage.setItem('player', 'playing');
            } else{

                localStorage.removeItem('player');
            }
                //localStorage.setItem('playerStataaaaaa', 'playing');



               // console.log('click');
          // });

            if(playStorage != 'playing'){

                if (mylist.playlist.length === 0) {
                    $(".player-title").html('Ops ... você precisa selecionar uma música ou um álbum.').fadeIn('fast');
                    return false;
                }

                $(this).parent().addClass("playing");

                var $player = $(".player");
                $player.find(".heart").attr('data-target', mylist.playlist[current].id_music);
                $player.find(".music-player-rating").attr('data-average', mylist.playlist[current].rate);
                $player.find(".music-player-rating").attr('data-id', mylist.playlist[current].id_music);

                $(".player .heart, .player .time, .player .buy, .player .music-player-rating, .player-title, .shuffle").fadeIn('fast');

                if (!mylist.playlist[current].fav) {
                    $player.find(".heart").addClass("favorite").removeClass("active unfavorite");
                } else {
                    $player.find(".heart").addClass("active unfavorite").removeClass("favorite");
                }

                e.preventDefault();



            } else{
               // $(".jp-play").click();
            }


        });

        /** actions to stop music */
        $(".jp-stop").on("click", function() {

            log.music(mylist.playlist[current].id_music, $("#jplayer").data("jPlayer").status.currentTime, mylist.playlist[current].id_artist, mylist.playlist[current].id_album);

            $(".player .heart").hide().data('target', '0');
            $(this).parent().removeClass("playing");
            $("#jplayer").jPlayer("stop");

        });

        /** actions to pause music */
        $(".jp-pause").on("click", function() {

            log.music(mylist.playlist[current].id_music, $("#jplayer").data("jPlayer").status.currentTime, mylist.playlist[current].id_artist, mylist.playlist[current].id_album);

        });

        /** shuffle playlist */
        $(".jp-shuffle").on("click", function() {

            $(this).toggleClass("active");
            mylist.playlist = ($(this).hasClass("active")) ? playlist.shuffle(mylist.playlist) : shuffle;

        });

        /** playlist popover */
        $(document).on("click", "[data-popover=playlist]", function(e) {

            if (!pleimo.Session.get('logged_in')) {
                load.Signin();
                return false;
            }

            $(".popover").remove();

            var object = $(e.target);
            var orientation = $(this).data('orientation');

            var now = (orientation !== "portrait");

            object.popover({
                selector: object,
                html: true,
                trigger: 'manual',
                content: playlist.open(object, mylist.playlist, now, orientation, mylist.current)
            });

            object.popover("show");
            e.preventDefault();

        });

        /*$(document).on('click', '.facebook-oauth', function(e) {

            FB.login(function(response) {

                if (response.authResponse) {

                    var pathname = (window.location.pathname).replace(/^\s+/, "/").replace(/^\/|\/$/g, '');
                    var qbuild = (pathname != "") ? "?signin=" + pathname : "?signin=home";

                    if (window.location.search) qbuild = window.location.search;

                    $(".facebook-oauth").addClass("wait").html("");

                    $.ajax({
                        type: "POST",
                        url: base_url + 'signin/connect' + qbuild
                    }).done(function(data) {

                        data = $.parseJSON(data);
                        //pleimo.Session = data.session;
                        pleimo.Session.checkAuth();

                        console.log('Session loaded');
                        console.log(pleimo.Session);

                        if (pleimo.Subscribe) {
                            pleimo.Template.Subscribe(pleimo.Subscribe);
                            return false;
                        }

                        if (pleimo.Geteasy != undefined && pleimo.Geteasy.Voucher == true) {
                            pleimo.Geteasy.Submit();
                            return false;
                        }

                        if (data.redirect)
                            load.Controller(data.redirect);
                        return false;

                    });
                }
            }, {
                scope: 'publish_stream, user_about_me, email, user_likes, friends_likes'
            });

        });*/

        $(".music-player-rating").jRating({
            rateInfosY: -35,
            rateMax: 5,
            step: true,
            canRateAgain: true,
            phpPath: base_url + 'musics/rate',
            smallStarsPath: assets_url + 'images/icon-player-star.png'
        });

        /** new-playlist */
        $("body").on("click", ".new-playlist", function(e) {

            var music = $(this).closest("li.music-item").data("music");

            playlist.create(music);

            GA.trackEvent('Playlist', 'Create', { 'eventLabel': music });


        });

        /** add song to playlist */
        $("body").on("click", ".add-to-playlist", function(e) {

            var music = $(this).closest("li.music-item").data("music");
            var list = $(this).data("playlist");

            $(this).append("<figure class='loading'></figure>");

            playlist.add(music, list, $(this));

            GA.trackEvent('Playlist', 'Add', { 'eventLabel': music + '[Playlist: ' + list + ']' });

            e.preventDefault();
        });

        /**
         * Call the page of artists sending the genre.
         *
         * @author Renato Biancalana da Silva <r.silva@pleimo.com>
         */
        /*$('a.gender-link').click(function() {

        });*/

        /**
         * Call signin modal
         *
         * @author Leonardo Moreira <developer@pleimo.com>
         * @see {load.Signin}
         */

        /*$(document).on("click", ".signin-button", function(e) {
            //load.Signin();
        });

        /**
         * Call signup modal
         *
         * @author Leonardo Moreira <developer@pleimo.com>
         * @see {load.Signup}
         */
        /*$(document).on("click", ".signup-button", function() {
            load.Signup();
        });*/

        /**
         * Call signup modal
         *
         * @author Leonardo Moreira <developer@pleimo.com>
         * @see {load.Signup}
         */
        /*$(document).on("click", ".remember-button", function() {
            load.Forgot();
        });*/

        /**
         * Call subscribe action
         *
         * @author Leonardo Moreira <developer@pleimo.com>
         * @see {load.Subscribe}
         */
        $(document).on("click", ".subscribe", function() {
          //  load.Subscribe($(this).data("subscribe"));
            //console.log($(this).data("subscribe"));

        });



        /**
         * Call the users terms.
         *
         * @author Leonardo Moreira <developer@pleimo.com>
         * @see {load.userTerms}
         */
       /* $(document).on('click', '.terms-users', function() {
            load.userTerms();
        });
*/
        /**
         * Call the artists terms.
         *
         * @author Leonardo Moreira <developer@pleimo.com>
         * @see {load.userTerms}
         */
        $(document).on('click', '.terms-artists', function() {
            load.userTermsArtists();
        });

        /**
         * Call the privacy policy.
         *
         * @author Leonardo Moreira <developer@pleimo.com>
         * @see {load.userTerms}
         */
        /*$(document).on('click', '.privacy-policy', function(e) {
            load.privacyPolicy();
        });*/

        /**
         * Logout and clean session.
         *
         * @author Leonardo Moreira <developer@pleimo.com>
         * @see {load.Logout}
         */
        $(document).on("click", ".logout", function() {
            load.Logout();
        });

        /**
         * Redirect to release page with gender selected.
         *
         * @author Leonardo Moreira <developer@pleimo.com>
         * @return void
         */
        /*$(document).on('click', '.gender-link', function() {
            form = "genre=" + $(this).data('gender');
            load.Controller('artists');
        });*/

        /**
         * Close mask when press escape key.
         *
         * @author Leonardo Moreira <developer@pleimo.com>
         * @see {closeMask}
         */
        document.onkeydown = function keypress(e) {
            e = (e || window.event);

            if (e.keyCode == 27) {
                try {
                    e.preventDefault();
                } catch (x) {
                    e.returnValue = false;
                }
                closeMask();
            }
        };

        $(document).on("click", ".popup", function() {

            var width = 640,
                height = 480,
                left = ($(window).width() - width) / 2,
                top = ($(window).height() - height) / 2,
                url = this.href,
                opts = 'status=1' +
                    ',width=' + width +
                    ',height=' + height +
                    ',top=' + top +
                    ',left=' + left;

            window.open(url, 'Pleimo (beta) - #pttp', opts);

            return false;

        });

        load = {

            "Controller": function(uri) {

                if (req != null)
                    req.abort();

                console.log('...' + uri);
                $(".content-loading").show();
                closeMask();

                $(document).scrollTop(0);
/*
                req = $.ajax({
                    type: method,
                    url: base_url + uri,
                    data: form,
                    statusCode: {
                        200: function(data, status) {

                            _gaq.push(['_trackPageview', "/" + uri]);

                            $(".content-loading").hide();

                            $("#main").html(data);

                            var $content = $("#content");
                            $content.removeClass();
                            $content.addClass(uri.replace(/\//g, ' '));

                            $(document).scrollTop(0);

                            if (pleimo.Session.get('logged_in'))
                                $(".playlist").show();

                            // masks
                            $content.find('.date').mask('11/11/1111');
                            $content.find('.time').mask('00:00:00');
                            $content.find('.date_time').mask('99/99/9999 00:00:00');
                            $content.find('.cep').mask('99999-999');
                            $content.find('.ddd').mask('99');
                            $content.find('.phone').mask('0{4,5}-0000', {
                                reverse: true
                            });
                            $content.find('.cellphone').mask('0{4,5}-0000', {
                                reverse: true
                            });
                            $content.find('.mixed').mask('AAA 000-S0S');
                            $content.find('.cpf').mask('999.999.999-99', {
                                reverse: true
                            });
                            $content.find('.money').mask('000.000.000.000.000,00', {
                                reverse: true
                            });
                            $content.find('.ip_address').mask('0ZZ.0ZZ.0ZZ.0ZZ', {
                                translation: {
                                    'Z': "[0-9]?"
                                }
                            });
                            $content.find('.numeric').bind("keyup paste", function() {
                                setTimeout(jQuery.proxy(function() {
                                    this.val(this.val().replace(/[^0-9]/g, ''));
                                }, $(this)), 0);
                            });

                            $content.find('.form-select a').each(function() {
                                var target = $(this).data('target') || '';
                                if (target.length > 0) {
                                    if ($("#" + target).is(":disabled")) {
                                        $(this).removeClass("active").addClass("disabled");
                                    }
                                }
                            });

                            $(document).trigger('ajaxloaded', [uri, status]);

                        },
                        203: function() {
                            window.location.replace(base_url + "home?signin=" + window.location.pathname);
                        },
                        404: function() {
                            load.Controller(e404);
                        },
                        500: function() {
                            $.ajax({
                                type: "POST",
                                url: base_url + "500"
                            }).done(function(data) {

                                openMask();

                                $(".content-loading").hide();
                                $('.modal').hide();
                                $("body").append(data);
                                $('.modal.error a').on('click', function() {
                                    $(this).parent().parent().remove();
                                    closeMask();
                                });

                            });
                        }
                    }
                });*/

            },

            "Signin": function(state, redirect) {

                openMask();



                redirect = (typeof redirect === 'undefined') ? window.location.search : redirect;


                $.ajax({
                    type: "POST",
                    url: base_url + "signin/" + redirect
                }).done(function(data) {

                    $('.modal').hide();
                    $("body").append(data);

                });

            },

            "Subscribe": function(plan) {

                if (!pleimo.Session.get('logged_in')) {
                    pleimo.Subscribe = plan;
                    pleimo.Template.Signin();
                    return false;
                }

                $.ajax({
                    type: "POST",
                    url: base_url + "plans/subscribe/" + plan
                }).done(function(data) {

                    pleimo.Subscribe = $.parseJSON(data);
                    pleimo.Template.Checkout();

                });
            },


            "Checkout": function() {

                if (!pleimo.Subscribe)
                    return false;

                openMask();

                $.ajax({
                    type: "POST",
                    url: base_url + "checkout",
                    data: {
                        "subscribe": pleimo.Subscribe
                    }
                }).done(function(data) {

                    $('.modal').hide();
                    $("body").append(data);

                });
            },

            "Signup": function(redirect) {

                openMask();

                redirect = (typeof redirect === 'undefined') ? window.location.search : redirect;

                $.ajax({
                    type: "POST",
                    url: base_url + "signup/" + redirect
                }).done(function(data) {
                    $('.modal').hide();
                    $("body").append(data);
                });
            },

            "Forgot": function() {
                openMask();

                $.ajax({
                    type: "POST",
                    url: base_url + "forgot"
                }).done(function(data) {
                    $('.modal').hide();
                    $("body").append(data);
                });
            },

            "userTerms": function() {
                openMask();

                $.ajax({
                    type: "POST",
                    url: base_url + "terms/users"
                }).done(function(data) {
                    $("body").append(data);
                });
            },

            "userTermsArtists": function() {
                openMask();

                $.ajax({
                    type: "POST",
                    url: base_url + "terms/artists"
                }).done(function(data) {
                    $("body").append(data);
                });
            },

            "privacyPolicy": function() {
                openMask();

                $.ajax({
                    type: "POST",
                    url: base_url + "terms/privacy"
                }).done(function(data) {
                    $("body").append(data);
                });
            },

            "Logout": function() {
                $.ajax({
                    type: "GET",
                    url: base_url + "logout"
                }).done(function() {
                    pleimo.Session.clear();
                    window.top.location = base_url;
                });
            },

            "Genders": function() {
                openMask();

                $.ajax({
                    type: "GET",
                    url: base_url + "genders"
                }).done(function(data) {
                    $('body').append(data);
                })
            },

            "Support": function() {
                openMask();

                $.ajax({
                    type: "GET",
                    url: base_url + "support"
                }).done(function(data) {
                    $('body').append(data);
                })
            }

        };

        pleimo.Template = load;

        /**
         * @author Leonardo Moreira <developer@pleimo.com>
         * @type {{shuffle: Function, create: Function, add: Function, open: Function}}
         */
        var playlist = {

            "shuffle": function(array) {

                var counter = array.length,
                    temp, index;

                while (counter--) {

                    index = (Math.random() * (counter + 1)) | 0;

                    temp = array[counter];
                    array[counter] = array[index];
                    array[index] = temp;

                }

                return array;
            },

            "create": function(music) {

                $.ajax({
                    type: "POST",
                    url: base_url + "xhr/playlist/create",
                    data: {
                        music: music
                    }
                }).done(function(data) {

                    openMask();
                    $("body").append("<div class='playlist-create wrapper outbox'>" + data + "</div>");

                    $.get(base_url+'application/www/language/playlists.xml', null, function (data, textStatus) {

                        if (textStatus == "success") language = data;

                    }, 'xml').done(function(){


                        //console.log('validate');

                        $("#form-create-playlist").validate({

                            errorElement: "span",

                            rules : {
                                "title" : {
                                    required: true
                                },
                                "desc" : {
                                    required: true
                                }
                            },

                            messages : {
                                "title" : {
                                    required: $(language).find('data text[id="playlist-create-title-error"] '+lang).text()
                                },
                                "desc" : {
                                    required: $(language).find('data text[id="playlist-create-desc-error"] '+lang).text()
                                }
                            },

                            success : function() {
                                errors = false;
                            },

                            invalidHandler  : function(form, validator) {
                                errors = true;
                            },

                            submitHandler: function(form) {

                                $("#form-create-playlist .submit").addClass('wait').val(null);

                                $.ajax({
                                    type: "POST",
                                    url: base_url+"xhr/playlist/save",
                                    data:  { music : $("#music").val(), title : $("#title").val(), desc : $("#desc").val(), privacy : $("#privacy").val() }
                                }).done(function() {
                                    closeMask();
                                });

                            }

                        });

                    });
                  //  e.preventDefault();

                });

            },

            "add": function(music, playlist, object) {

                $.ajax({
                    type: "POST",
                    url: base_url + "xhr/playlist/add",
                    data: {
                        music: music,
                        playlist: playlist
                    }
                }).done(function() {

                    $(object).find("figure").remove();
                    $(object).append("<i class=\"check\"></i>");

                    if (mylist.playlist.length === 0) $(object).addClass('action-play').trigger('click');

                });

            },

            "open": function(object, playlist, now, orientation, current) {

                $.post(base_url + "xhr/playlist", {
                    playlist: playlist,
                    now: now,
                    orientation: orientation,
                    current: current
                }).done(function(data) {

                    if ($(object).next().hasClass("popover")) $(object).next().find(".popover-content").empty().html(data);

                    var heigth = ($(object).next().find(".popover-content").height() - 20);
                    var width = ($(object).next().find(".popover-content").width() - 156);

                    if ($(object).next().hasClass("popover")) {
                        if (orientation === "portrait") $(object).next().offset({
                            top: $(object).next().offset().top - (heigth / 2)
                        });
                        if (orientation === "landscape") $(object).next().offset({
                            top: $(object).next().offset().top - heigth,
                            left: $(object).next().offset().left - (width / 2)
                        });
                    }

                });

                return "<figure class='loading'></figure>";

            }

        };

        /**
         * @author Leonardo Moreira <developer@pleimo.com>
         * @type {{music: Function}}
         */
        var log = {

            "music": function(music, time, artist, album) {

                $.ajax({
                    type: "POST",
                    url: base_url + 'musics/log',
                    data: {
                        "music": music,
                        "time": time,
                        "artist": artist,
                        "album": album
                    }
                });

            }

        };

        $('input[placeholder]').each(function() {

            var ph = $(this).attr('placeholder');

            $(this).val(ph).focus(function() {
                if ($(this).val() == ph) $(this).val('');
            }).blur(function() {
                if (!$(this).val()) $(this).val(ph);
            });

        });

        _gaq.push(['_setAccount', 'UA-38139918-1']);
        _gaq.push(['_setDomainName', 'pleimo.com']);

        (function() {
            var ga = document.createElement('script');
            ga.type = 'text/javascript';
            ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ga, s);
        })();

        (function() {
            var viewport = document.getElementById('viewport');
            if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) {
                viewport.setAttribute("content", "initial-scale=0.3, maximum-scale=0.4");
            }
        }());

        window.fbAsyncInit = function() {
            FB.init({
                appId: '258992677489016',
                cookie: true,
                status: true,
                xfbml: true,
                oauth: true,
                channelUrl: 'http://www.pleimo.com/channel.html'
            });
        };

        (function(d) {
            var js, id = 'facebook-jssdk',
                ref = d.getElementsByTagName('script')[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement('script');
            js.id = id;
            js.async = true;
            js.src = "//connect.facebook.net/en_US/all.js";
            ref.parentNode.insertBefore(js, ref);
        }(document));

        window.pleimo = pleimo;

   // });
});
