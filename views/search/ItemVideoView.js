define(function(require){
    "use strict";

    var $                = require('jquery'),
        ItemView         = require('views/search/ItemView'),
        ContentFactory   = require('views/ContentFactory'),
        GA               = require('gga');

    var viewFactory = new ContentFactory();

    var ItemVideoView = ItemView.extend({
        url: '/search/video',
        onItemMouseover: function() {
            $(this).parents('.item').find('div.hover').show();
        },
        onItemMouseout: function() {
            $(this).parents('.item').find('div.hover').hide();
        },
        addEvents: function() {
            this.$el
                .off('.video')
                .on('mouseenter.video', '.search-hover', this.onItemMouseover)
                .on('mouseleave.video', '.search-hover', this.onItemMouseout)
                .on('click.video', '[data-apiid]', function(e) {
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

    return ItemVideoView;
});