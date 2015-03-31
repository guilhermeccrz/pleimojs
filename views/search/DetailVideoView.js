define(function(require){
    "use strict";

    var $                = require('jquery'),
        DetailItemView   = require('views/search/DetailItemView'),
        ContentFactory   = require('views/ContentFactory'),
        GA               = require('gga');

    var viewFactory = new ContentFactory();

    var DetailVideoView = DetailItemView.extend({
        url: '/search/detail/videos',
        onItemMouseover: function() {
            $(this).find('div.hover').show();
        },
        onItemMouseout: function() {
            $(this).find('div.hover').hide();
        },
        addEvents: function() {
            this.$el
                .off('.detail-video')
                .on('mouseenter.detail-video', '.search-hover', this.onItemMouseover)
                .on('mouseleave.detail-video', '.search-hover', this.onItemMouseout)
                .on('click.detail-video', '[data-apiid]', function(e) {
                    e.preventDefault();

                    GA.trackEvent('Video', 'Open', { 'eventLabel': 'Search: '+ $(e.currentTarget).data('apiid') + ' [' + $(e.currentTarget).attr('title') + ']' });

                    var apiid = $(this).data('apiid');
                    viewFactory.getView('modals/VideoView', function(view) {
                        view.render(apiid);
                        view.open();
                    });
                });
        }
    });

    return DetailVideoView;
});