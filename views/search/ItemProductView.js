define(function(require){
    "use strict";

    var ItemView        = require('views/search/ItemView');

    var ItemProductView = ItemView.extend({
        url: '/search/product',
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

    return ItemProductView;
});