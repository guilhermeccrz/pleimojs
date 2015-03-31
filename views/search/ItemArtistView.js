define(function(require){
    "use strict";

    var ItemView       = require('views/search/ItemView');

    var ItemArtistView = ItemView.extend({
        url: '/search/artist',
        onItemMouseover: function() {
            $(this).parents('.item').find('div.hover').show();
        },
        onItemMouseout: function() {
            $(this).parents('.item').find('div.hover').hide();
        },
        addEvents: function() {
            this.$el
                .off('.artist')
                .on('mouseenter.artist', '.search-hover', this.onItemMouseover)
                .on('mouseleave.artist', '.search-hover', this.onItemMouseout);
        }
    });

    return ItemArtistView;
});