define(function(require){
    "use strict";

    var DetailItemView      = require('views/search/DetailItemView');

    var DetailAlbumView = DetailItemView.extend({
        url: '/search/detail/albums',
        onItemMouseover: function() {
            $(this).find('div.hover').show();
        },
        onItemMouseout: function() {
            $(this).find('div.hover').hide();
        },
        addEvents: function() {
            this.$el.find('.search-hover')
                .off('.detail-album')
                .on('mouseenter.detail-album', this.onItemMouseover)
                .on('mouseleave.detail-album', this.onItemMouseout);
        }
    });

    return DetailAlbumView;
});