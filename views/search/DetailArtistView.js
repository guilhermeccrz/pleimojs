define(function(require){
    "use strict";

    var DetailItemView   = require('views/search/DetailItemView');

    var DetailArtistView = DetailItemView.extend({
        url: '/search/detail/artists',
        onItemMouseover: function() {
            $(this).find('div.hover').show();
        },
        onItemMouseout: function() {
            $(this).find('div.hover').hide();
        },
        addEvents: function() {
            this.$el.find('.search-hover')
                .off('.detail-artist')
                .on('mouseenter.detail-artist', this.onItemMouseover)
                .on('mouseleave.detail-artist', this.onItemMouseout);
        }
    });

    return DetailArtistView;
});