// GetEasyVoucherView.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        ModalModel      = require('models/ui/ModalModel'),
        ModalView       = require('views/ui/ModalView');

    var GetEasyVoucherView = ModalView.extend({
        initialize: function() {
            this.model = new ModalModel({
                className: '.modal.error-geteasy.outbox',
                content: ''
            });

            this.model.on('change:isOpen', this.toggle, this);
        },
        events: {
            "click #mask": "close"
        },
        render: function() {
            var template = '/geteasy/voucher_invalid_modal';

            var that = this;
            $.ajax({
                type : "GET",
                url  : template
            }).done(function(data){
                that.setContent(data);
            });
        }
    });

    return GetEasyVoucherView;
});