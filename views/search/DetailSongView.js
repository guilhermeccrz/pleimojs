define(function(require){
    "use strict";

    var DetailItemView        = require('views/search/DetailItemView');

    var DetailSongView = DetailItemView.extend({
        url: '/search/detail/songs',
        onItemMouseover: function() {
            $(this).find('div.hover').show();
        },
        onItemMouseout: function() {
            $(this).find('div.hover').hide();
        },
        addEvents: function() {
            this.$el.find('.search-hover')
                .off('.detail-song')
                .on('mouseenter.detail-song', this.onItemMouseover)
                .on('mouseleave.detail-song', this.onItemMouseout);
        }
    });

    return DetailSongView;
});