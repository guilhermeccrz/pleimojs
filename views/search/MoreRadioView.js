define(function(require){
    "use strict";

    var MoreItemView = require('views/search/MoreItemView');

    var MoreRadioView = MoreItemView.extend({
        url: '/search/more/radios',
        className: 'radios',
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

    return MoreRadioView;
});