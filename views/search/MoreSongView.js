define(function(require){
    "use strict";

    var MoreItemView = require('views/search/MoreItemView');

    var MoreAlbumView = MoreItemView.extend({
        url: '/search/more/songs',
        className: 'songs',
        onItemMouseover: function() {
            $(this).parents('.item').find('div.hover').show();
        },
        onItemMouseout: function() {
            $(this).parents('.item').find('div.hover').hide();
        },
        addEvents: function() {
            this.$el
                .off('.song')
                .on('mouseenter.song', '.search-hover', this.onItemMouseover)
                .on('mouseleave.song', '.search-hover', this.onItemMouseout);
        }
    });

    return MoreAlbumView;
});