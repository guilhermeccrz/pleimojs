$(function () {
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    //var params = { allowScriptAccess : 'always', wmode : 'opaque' };
    //var atts = { id:'myytplayer'};

    var videoID = (lang == 'en-US'?'9J6Je8htUiw':'PpaPRZQRWRA');

    var player;
    window.onYouTubeIframeAPIReady = function() {
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
                    event.target.playVideo();

                    $(".player .play-big").on("click", function(){
                        $('.video .player').hide();
                        player.seekTo(0);
                        player.unMute();
                        player.setPlaybackQuality("hd1080");
                        player.playVideo();
                    });
                }
            }
        });
    };

    //swfobject.embedSWF("https://www.youtube.com/v/"+videoID+"?enablejsapi=1&playerapiid=myytplayer&version=3&autohide=1&loop=1&controls=0&modestbranding=1&showinfo=0&iv_load_policy=3", "ytapiplayer", "100%", "550", "8", null, null, params, atts);

    //$('#ytapiplayer').replaceWith('<iframe id="ytplayer" type="text/html" width="100%" height="100%" src="https://www.youtube.com/embed/' + videoID + '?controls=0&enablejsapi=1&loop=1&modestbranding=1&showinfo=0&theme=light&origin=https://pleimo.com" frameborder="0" allowfullscreen></iframe>');

    $.get(base_url+'application/www/language/artists.xml', null, function (data, textStatus) {

        if (textStatus == "success") language = data;

    }, 'xml').done(function(){});

    /*var youtube = {

        'play' : function() {

            if (ytplayer) {
                ytplayer.setPlaybackQuality("hd1080");
                ytplayer.playVideo();
            }

        },

        'load' : function(object, video) {

            if (ytplayer) {
                ytplayer.cueVideoById(video);
                youtube.play();
            }

        }

    };

    window.onYouTubePlayerReady = function(playerId) {
        ytplayer = document.getElementById(playerId);
        ytplayer.mute();
        youtube.play();
    }*/
});
