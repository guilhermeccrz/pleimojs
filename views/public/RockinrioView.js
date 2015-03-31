// Filename: RockinrioView.js
define(function(require){

    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone'),
        ContentFactory  = require('views/ContentFactory');
        require('instafeed');

    var viewFactory = new ContentFactory();

    var rir = {
        feed: null,
        init: function() {
            /* jshint ignore:start */
            this.load();
            this.feed = new Instafeed({
                get: 'user',
                clientId: 'fded1394038e4a758c73d166fdff38ef',
                userId: 355069048,
                accessToken: '355069048.467ede5.9bd5146804a148fc904ad4ddf12f5953',
                target: 'instagram-result',
                limit: 10,
                template: '<div class="clip"><figure><div class="desc"><span class="bg"></span><p>{{caption}}</p></div><img src="{{image}}" width="200" /></figure><a href="{{link}}" title="{{caption}}" target="_blank"></a></div>',
                before: function() {
                    $('#instagram-result').empty();
                },
                after: function() {
                    $('#instagram-result div.clip').each(function() {
                        if ($(this).index() % 4 === 0) {
                            $(this).addClass('ml0');
                        }
                    });
                }
            });
            this.feed.run();
            /* jshint ignore:end */
        },
        load: function() {
            var that = this;

            $.ajax({
                url: 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=28&playlistId=PLmcrZe7K5PVJDNbU6dq5JQD3VEUCa1ibq&key=AIzaSyCb7dBhxaW_xkZl-Hqtf160rHE4FZ8yRDI',
                success: function(data) {
                    that.onLoad(data);
                }
            });
        },
        onLoad: function(data) {
            var that = this;

            if (data){
                var items = data.items || [];
                var itemsLen = data.items.length;
                var html = '';
                if (itemsLen > 0) {
                    for (var i = 0; i < itemsLen; i++) {
                        html += '<li data-apiid="' + items[i].snippet.resourceId.videoId + '">';
                        html += '<figure><div class="desc"><span class="bg"></span><p>';
                        html += that.crop(items[i].snippet.title, 35);
                        html += '</p></div>';
                        html += '<img src="' + items[i].snippet.thumbnails.medium.url + '" alt="' + items[i].snippet.title + '">';
                        html += '</figure>';
                        html += '<a href="http://www.youtube.com/watch?v=PdgkXDAEw2s" title="' + items[i].snippet.title + '"></a>';
                        html += '</li>';
                    }
                }
                $('#social_youtube ul').html(html);

                $(document).off('click.rir').on("click.rir", "#social_youtube ul li a", function(e){
                    that.showVideo($(this).parent(), e);

                    e.preventDefault();
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

            var apiid = $(el).data('apiid');
            viewFactory.getView('modals/VideoView', function(view) {
                view.render(apiid);
            });

        }
    };

    var RockinrioView = Backbone.View.extend({
        el: $("#main"),
        template: '/rockinrio',
        render: function() {
            var that = this;

            if (!$('#content').hasClass('rir')) {
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
           rir.init();
        }
    });

    return RockinrioView;
});