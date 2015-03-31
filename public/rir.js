(function($){
var pleimo = window.pleimo || {};
pleimo.rir = {
    init: function() {
        this.load();
        this.feed.run();
    },
    feed: new Instafeed({
        get: 'user',
        clientId: 'fded1394038e4a758c73d166fdff38ef',
        userId: 355069048,
        accessToken: '355069048.467ede5.9bd5146804a148fc904ad4ddf12f5953',
        target: 'instagram-result',
        limit: 10,
        template: '<div class="clip"><figure><div class="desc"><span class="bg"></span><p>{{caption}}</p></div><img src="{{image}}" width="200" /></figure><a href="{{link}}" title="{{caption}}" target="_blank"></a></div>',
        before: function() {
            jQuery('#instagram-result').empty();
        },
        after: function() {
            jQuery('#instagram-result div.clip').each(function() {
                if (jQuery(this).index() % 4 == 0) {
                    jQuery(this).addClass('ml0');
                }
            });
        }
    }),
    load: function() {
        $.ajax({
            url: 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=28&playlistId=PLmcrZe7K5PVJDNbU6dq5JQD3VEUCa1ibq&key=AIzaSyCb7dBhxaW_xkZl-Hqtf160rHE4FZ8yRDI',
            success: function(data) {
                pleimo.rir.onLoad(data);
            }
        });
    },
    onLoad: function(data) {
        if (data){ 
            var items = data.items || [];
            var itemsLen = data.items.length;
            var html = '';
            if (itemsLen > 0) {
                for (var i = 0; i < itemsLen; i++) {
                    html += '<li data-apiid="' + items[i].snippet.resourceId.videoId + '">';
                    html += '<figure><div class="desc"><span class="bg"></span><p>';
                    html += pleimo.rir.crop(items[i].snippet.title, 35);
                    html += '</p></div>';
                    html += '<img src="' + items[i].snippet.thumbnails.medium.url + '" alt="' + items[i].snippet.title + '">';
                    html += '</figure>';
                    html += '<a href="http://www.youtube.com/watch?v=PdgkXDAEw2s" title="' + items[i].snippet.title + '"></a>';
                    html += '</li>';
                }
            }
            $('#social_youtube ul').html(html);

            $(document).on("click", "#social_youtube ul li", function(e){
                pleimo.rir.showVideo($(this), e);
            });
        }
    },
    crop: function(str, len) {
        var result = str;
        if (str.length > len) {
            result = str.substr(0, len) + '...';
        }
        return result;
    },
    showVideo: function(el, ev) {
        ev.preventDefault();
        openMask();
        $.get(base_url+'application/www/views/search/yt-player.php', { "API_ID" : $(el).data('apiid') }, function( data ) {
            $("body").append(data);
        });
    }
}
pleimo.rir.init();
window.pleimo = pleimo;
})(jQuery);