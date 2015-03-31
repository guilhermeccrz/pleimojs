// CartCouponView.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        ModalModel      = require('models/ui/ModalModel'),
        ModalView       = require('views/ui/ModalView');

    var base_url = window.base_url;

    var CartCouponView = ModalView.extend({
        initialize: function() {
            this.model = new ModalModel({
                className: '.modal.error.outbox',
                content: ''
            });

            this.model.on('change:isOpen', this.toggle, this);
        },
        events: {
            "click #mask": "close",
            "click a.btn-close": "close"
        },
        render: function(id) {
            var that = this;

            that.open();

            $.ajax({
                type : "POST",
                url  : base_url+"coupon"
            }).done(function(data) {
                $("body").append(data);
            });

        }
    });

    return CartCouponView;
});