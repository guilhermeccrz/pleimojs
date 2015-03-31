define(function(require){
    "use strict";

    var MoreItemView = require('views/search/MoreItemView');

    var MoreAlbumView = MoreItemView.extend({
        url: '/search/more/albums',
        className: 'albums',
        onItemMouseover: function() {
            $(this).parents('.item').find('div.hover').show();
        },
        onItemMouseout: function() {
            $(this).parents('.item').find('div.hover').hide();
        },
        addEvents: function() {
            this.$el.find('.search-hover').off('.album');
            this.$el.find('.search-hover').on('mouseenter.album', this.onItemMouseover);
            this.$el.find('.search-hover').on('mouseleave.album', this.onItemMouseout);
        }
    });

    return MoreAlbumView;
});