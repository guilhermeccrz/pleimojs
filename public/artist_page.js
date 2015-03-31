$(function () {

    var tab    = null;
    var hash   = (location.pathname).split("/");
    var params = { allowScriptAccess : 'always', wmode : 'opaque' };
    var atts   = { id : 'myytplayer'};

    if (videos && videos.length > 0) swfobject.embedSWF("https://www.youtube.com/v/"+videos[0].API_ID+"?enablejsapi=1&playerapiid=ytplayer&version=3&autohide=1&controls=1&modestbranding=1&showinfo=0&iv_load_policy=3", "ytapiplayer", "100%", "550", "8", null, null, params, atts);

    $.get(base_url+'application/www/language/artists.xml', null, function (data, textStatus) {

        if (textStatus == "success") language = data;

    }, 'xml').done(function(){

        $("#content").addClass('artist');

        if ($("#similar-carousel").length > 0) slider.similar();
        if ($("#albums-carousel").find("li").length > 0) slider.albums();
        if ($(".products-list").find("li").length > 0) slider.products();

        $("section.products-list ul li").on("click", function(){
            products.Details($(this).data('id'));
        });

        if (videos && videos.length > 0)
        {
            slider.video();
            onYouTubePlayerReady("myytplayer");
        }

        if ((hash[2] !== "bio" && hash[2] !== "video") && hash[3])
        {
            $(".music-list").hide();
            $(".albums-nav li").removeClass("active");

            $("[data-id="+hash[2]+"]").parent().parent().addClass("active");
            $("[data-id="+hash[2]+"]").show();
        }

        if (hash[2] === "bio")
        {
            tab = "bio-tab";

            $("#tabs li").removeClass('active');
            $("."+tab).parent().addClass("active");

            $(".tab").hide();
            $("#"+tab).fadeIn(100);

            slider.photo();

            var st = 90;
            if ($(document).find(".artist.intro").length > 0)
                st = 520;

            $(document).scrollTop(st);
        }

        if (hash[2] === "product")
        {
            $('[data-token='+hash[3]+']').trigger("click");
        }

        $("#photos-carousel img").on("click", function(){

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

            var st = 290;
            if ($(document).find(".artist.intro").length > 0)
                st = 720;
            $(document).scrollTop(st);

        });

        $(".flag").on("click", function(){

            var picture = $(this).data('picture');

            openMask();
            $("body").append("<div class='flag modal blackbox'><hgroup><h3>"+$(language).find('data text[id="artist-flag"] '+lang).text()+"</h3></hgroup><ul><li><input type='radio' name='flag' id='flag' value='1'> "+$(language).find('data text[id="artist-flag-offensive"] '+lang).text()+"</li> <li><input type='radio' name='flag' id='flag' value='2' checked='checked'> "+$(language).find('data text[id="artist-flag-wrong"] '+lang).text()+"</li> <li><input type='radio' name='flag' id='flag' value='3'> "+$(language).find('data text[id="artist-flag-copyright"] '+lang).text()+"</li> <li><input type='radio' name='flag' id='flag' value='4'> "+$(language).find('data text[id="artist-flag-scam"] '+lang).text()+"</li></ul><input type='button' class='button' onclick='javascript:void(0);' value='Enviar' /></div>");

            $(".flag .button").click(function(){

                $.ajax({
                    type: "POST",
                    data: ({'picture' : picture}),
                    url: base_url+"artist/picture/flag"
                }).done(function( data, status, response ) {

                    closeMask();

                });

            });

        });

        $("#tabs li a").on("click", function(e) {

            var target = base_url+hash[1];

            tab = $(this).data("tab");

            $("#tabs li").removeClass('active');
            $("."+tab).parent().addClass("active");

            $(".tab").hide();
            $("#"+tab).fadeIn(100);

            if (tab == "bio-tab") {
                slider.photo();
                target = target+"/bio";
            }

            var st = 90;
            if ($(document).find(".artist.intro").length > 0)
                st = 520;

            $(document).scrollTop(st);

            History.pushState(null, null, target);
            e.preventDefault();
        });

        $(".select-album").on("click", function(e) {

            $(".music-list").hide();
            $(".albums-nav li").removeClass("active");

            $(this).parent().parent().addClass("active");
            $("[data-album="+$(this).data("album")+"]").show();

            History.pushState(null, null, base_url+hash[1]+"/"+$(this).data("id")+"/"+$(this).data("album"));
            e.preventDefault();

        });

        $(document).ready(function(){
            if (hash[2] == 'video'){
                setTimeout(function() { youtube.play(); }, 500);
            }
        });

        $(".player .play-big").on("click", function(){
            youtube.play();
        });

        $(".play-queue").on("click", function(){
            youtube.load($(this).data('object'), $(this).data('video'));
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

                if ($("#jplayer").data("jPlayer").status.currentTime>0 && $("#jplayer").data("jPlayer").status.paused===false) {
                    $(".jp-pause").trigger('click');
                }
            }

        },

        'load' : function(object, video) {

            if (ytplayer) {

                if ((videos[object].TITLE).length > 65) videos[object].TITLE = videos[object].TITLE.substr(0, 65)+"...";

                $(".videos .title").html(videos[object].TITLE);

                $('li.grid_1').find('[data-target]').remove();

                var classes = ' favorite ';
                if ($(document).find("[data-video='"+videos[object].API_ID+"']").hasClass('fav'))
                {
                    classes = ' active unfavorite ';
                }

                $('li.grid_1').first().append('<a href="javascript:void(0);" class="heart'+classes+'" data-type="video" data-target="'+videos[object].ID_VIDEO+'"></a>');

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

        'similar' : function() {
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
        },

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

    var products = {

        "Details" : function(product) {

            openMask();

            $.ajax({
                type : "POST",
                data : {'product' : product},
                url  : base_url+"products/details"
            }).done(function(data){
                $('body').append(data);
            });

        }

    };

    function onYouTubePlayerReady(playerId) {
        ytplayer = document.getElementById(playerId);
    }

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return (results === null) ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    var donate = getParameterByName("donation");

    if (donate == "success")
    {
        $.ajax({
            type : "GET",
            url  : base_url+"crowd/donation_success"
        }).done(function(data) {

            $('.modal').remove();
            openMask();
            $('body').append(data);

            $('.btn-finish').on('click',function(e){
                closeMask();
                $('.modal').remove();
            });

        });
    }


    // hide artist content
    if ($('#bio-tab').text().trim().length < 10) $('nav.artist.nav').hide();


});
