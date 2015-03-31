define(function(require){
    "use strict";

    var ItemView        = require('views/search/ItemView');

    var ItemRadioView = ItemView.extend({
        url: '/search/radio',
        onItemMouseover: function() {
            $(this).parents('.item').find('div.hover').show();
        },
        onItemMouseout: function() {
            $(this).parents('.item').find('div.hover').hide();
        },
        addEvents: function() {
            this.$el
                .off('.radio')
                .on('mouseenter.radio', '.search-hover', this.onItemMouseover)
                .on('mouseleave.radio', '.search-hover', this.onItemMouseout);
        }
    });

    return ItemRadioView;
});