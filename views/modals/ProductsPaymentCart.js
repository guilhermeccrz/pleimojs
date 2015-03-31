// ProductPaymentCartView.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        ModalModel      = require('models/ui/ModalModel'),
        ModalView       = require('views/ui/ModalView');

    var base_url = window.base_url;

    var ProductPaymentCartView = ModalView.extend({
        initialize: function() {
            this.model = new ModalModel({
                className: '.modal.outbox.cart-added',
                content: ''//template
            });

            this.model.on('change:isOpen', this.toggle, this);
        },
        events: {
            "click #mask": "close",
            "click .btn-close": "closeModal",
            "click .cart-added a.load": "close"
        },

        closeModal: function(){
            $('.outbox').remove();
            $("#mask").hide();

            $(this).data('view').close();
        },

        render: function() {
            var that = this;
            $(document).scrollTop(0);

            $.ajax({
                type: "POST",
                url: base_url+'products/added'
            }).done(function(data) {
                that.setContent(data);
                that.addEvents();
            });
        },

        addEvents: function() {
            var that = this;

            $(this).data("view", this);

            var $modal = $('.modal.outbox.cart-added');
            $modal.find('.btn-gray').click(function(){
                that.closeModal();
            });

            $modal.find('.btn-gray').data('view', that);
            $modal.find('.btn-close').data('view', that);
        }
    });

    return ProductPaymentCartView;
});