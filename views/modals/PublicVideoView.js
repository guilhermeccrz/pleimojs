// PublicVideo.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        ModalModel      = require('models/ui/ModalModel'),
        ModalView       = require('views/ui/ModalView');

    var base_url = window.base_url;
    
    var PublicVideoView = ModalView.extend({
        initialize: function() {
            this.model = new ModalModel({
                className: '.modal.youtube',
                content: ''
            });

            this.model.on('change:isOpen', this.toggle, this);
        },
        events: {
            "click div#mask": "close"
        },
        render: function(el) {

            this.open();
            $.get(base_url+'application/www/views/search/yt-player.php', { "API_ID" : $(el).data('apiid') }, function( data ) {
                $("body").append(data);
            });

        }
    });

    return PublicVideoView;
});