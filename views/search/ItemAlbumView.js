define(function(require){
    "use strict";

    var ItemView      = require('views/search/ItemView');

    var ItemAlbumView = ItemView.extend({
        url: '/search/album',
        onItemMouseover: function() {
            $(this).parents('.item').find('div.hover').show();
        },
        onItemMouseout: function() {
            $(this).parents('.item').find('div.hover').hide();
        },
        addEvents: function() {
            this.$el
                .off('.album')
                .on('mouseenter.album', '.search-hover', this.onItemMouseover)
                .on('mouseleave.album', '.search-hover', this.onItemMouseout);
        }
    });

    return ItemAlbumView;
});