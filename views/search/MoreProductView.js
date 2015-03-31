define(function(require){
    "use strict";

    var MoreItemView = require('views/search/MoreItemView');

    var MoreArtistView = MoreItemView.extend({
        url: '/search/more/products',
        className: 'products',
        onItemMouseover: function() {
            $(this).parents('.item').find('div.hover').show();
        },
        onItemMouseout: function() {
            $(this).parents('.item').find('div.hover').hide();
        },
        addEvents: function() {
            this.$el
                .off('.product')
                .on('mouseenter.product', '.search-hover', this.onItemMouseover)
                .on('mouseleave.product', '.search-hover', this.onItemMouseout);
        }
    });

    return MoreArtistView;
});