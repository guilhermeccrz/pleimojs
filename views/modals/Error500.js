// Error500.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        ModalModel      = require('models/ui/ModalModel'),
        ModalView       = require('views/ui/ModalView');

    var Error500 = ModalView.extend({
        initialize: function() {
            this.model = new ModalModel({
                className: '.modal.error.error-500.outbox',
                content: ''
            });

            this.model.on('change:isOpen', this.toggle, this);
        },
        events: {
            "click #mask": "close",
            "click a.button": "close"
        },
        render: function() {
            var template = '/500';

            var that = this;
            $.ajax({
                type : "GET",
                url  : template
            }).done(function(data){
                that.setContent(data);
            });
        }
    });

    return Error500;
});