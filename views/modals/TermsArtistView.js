// TermsArtistView.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        ModalModel      = require('models/ui/ModalModel'),
        ModalView       = require('views/ui/ModalView');

    var TermsArtistView = ModalView.extend({
        initialize: function() {
            this.model = new ModalModel({
                className: '.modal.wrapper.outbox',
                content: ''
            });

            this.model.on('change:isOpen', this.toggle, this);
        },
        events: {
            "click #mask": "close"
        },
        render: function() {
            var template = '/terms/artists';

            var that = this;
            $.ajax({
                type : "GET",
                url  : template
            }).done(function(data){
                that.setContent(data);
            });

            this.setContent(template);

          /*  $.ajax({
                type : "GET",
                url  : base_url+'terms/artists'
            }).done(function( data ) {

                $("body").append("<div class='modal wrapper outbox'><button class=\"round-button close\"></button>"+$('.grid_18.main_full', data).html()+"<button class=\"round-button close\"></div>");

            });*/
        }
    });

    return TermsArtistView;
});