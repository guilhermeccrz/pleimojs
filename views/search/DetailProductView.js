define(function(require){
    "use strict";

    var DetailItemView    = require('views/search/DetailItemView');

    var DetailProductView = DetailItemView.extend({
        url: '/search/detail/products',
        onItemMouseover: function() {
            $(this).find('div.hover').show();
        },
        onItemMouseout: function() {
            $(this).find('div.hover').hide();
        },
        addEvents: function() {
            this.$el.find('.search-hover')
                .off('.detail-product')
                .on('mouseenter.detail-product', this.onItemMouseover)
                .on('mouseleave.detail-product', this.onItemMouseout);
        }
    });

    return DetailProductView;
});