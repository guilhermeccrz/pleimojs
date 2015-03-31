define(function(require){
    "use strict";

    var MoreItemView = require('views/search/MoreItemView');

    var MoreArtistView = MoreItemView.extend({
        url: '/search/more/artists',
        className: 'artists',
        onItemMouseover: function() {
            $(this).parents('.item').find('div.hover').show();
        },
        onItemMouseout: function() {
            $(this).parents('.item').find('div.hover').hide();
        },
        addEvents: function() {
            this.$el.find('.search-hover').off('.artist');
            this.$el.find('.search-hover').on('mouseenter.artist', this.onItemMouseover);
            this.$el.find('.search-hover').on('mouseleave.artist', this.onItemMouseout);
        }
    });

    return MoreArtistView;
});