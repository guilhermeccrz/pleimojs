// VoucherView.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        ModalModel      = require('models/ui/ModalModel'),
        ModalView       = require('views/ui/ModalView');

    var VideoView = ModalView.extend({
        initialize: function() {
            this.model = new ModalModel({
                className: '.modal.outbox.youtube.searchvideo',
                content: ''
            });

            this.model.on('change:isOpen', this.toggle, this);
        },
        events: {
            "click #mask": "close"
        },
        render: function(apiid) {
            var that = this;
            $.get(window.base_url+'application/www/views/search/yt-player.php', { "API_ID" : apiid }, function( data ) {
                that.setContent(data);
            });
        }
    });

    return VideoView;
});