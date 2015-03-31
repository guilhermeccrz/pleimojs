define(function(require){
    "use strict";

    var ItemView        = require('views/search/ItemView');

    var ItemSongView = ItemView.extend({
        url: '/search/song',
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

    return ItemSongView;
});