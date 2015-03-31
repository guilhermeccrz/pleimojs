define(function(require){
    "use strict";

    var DetailItemView  = require('views/search/DetailItemView');

    var DetailRadioView = DetailItemView.extend({
        url: '/search/detail/radios',
        onItemMouseover: function() {
            $(this).find('div.hover').show();
        },
        onItemMouseout: function() {
            $(this).find('div.hover').hide();
        },
        addEvents: function() {
            this.$el.find('.search-hover')
                .off('.detail-radio')
                .on('mouseenter.detail-radio', this.onItemMouseover)
                .on('mouseleave.detail-radio', this.onItemMouseout);
        }
    });

    return DetailRadioView;
});