// BioYoutubeView.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        ModalModel      = require('models/ui/ModalModel'),
        ModalView       = require('views/ui/ModalView');

    var base_url = window.base_url;

    var BioYoutubeView = ModalView.extend({
        initialize: function() {
            this.model = new ModalModel({
                className: '.modal.error.outbox',
                content: ''
            });

            this.model.on('change:isOpen', this.toggle, this);
        },
        events: {
            "click #mask": "close"
        },
        render: function(id) {
            var that = this;

            $.get(base_url+'application/www/views/artists/register/yt-player.php', { "API_ID" : id }, function( data ) {
                that.setContent(data);
            });
        }
    });

    return BioYoutubeView;
});