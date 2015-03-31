// AllProductsView.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        ModalModel      = require('models/ui/ModalModel'),
        ModalView       = require('views/ui/ModalView');

    var pleimo = window.pleimo || {};
    var lang = window.lang;

    var AllProductsView = ModalView.extend({
        initialize: function() {

            this.model = new ModalModel({
                className: 'modal dashboard-store products outbox'
            });

            this.model.on('change:isOpen', this.toggle, this);
        },

        events: {
            "click #mask": "close"
        },

        render: function(artist) {

            var that = this;

            $.ajax({
                type : "POST",
                data : ({artist : artist, page : 1}),
                url  : window.base_url+'dashboard/mystore/products',
                beforeSend : function() {
                    that.setContent('<div class="modal dashboard-store products outbox loading"></div>');
                },
                success : function(data) {
                    pleimo.Store.url = 'dashboard/mystore/products/content';
                    pleimo.Store.modal = $('div.modal.products');
                    pleimo.Store.artist = artist;

                    $('div.modal.products').removeClass('loading');
                    $('div.modal.products').append(data);

                    pleimo.Store.pagination();
                }
            });

            $(document).off('click.delete-product').on('click.delete-product', '.btn-delete-product', function(e) {
                 e.preventDefault();
                 that.remove($(this));
                 e.stopImmediatePropagation();
            });
        },

        remove: function(element){

            var language;

            $.get(window.base_url+'application/www/language/dashboard.xml', null, function (data, textStatus) {

                if (textStatus == "success") language = data;

            }, 'xml').done(function(){

                var product = $(element).data('product');

                $.ajax({
                    type : "POST",
                    url  : window.base_url+'register/product/remove',
                    data : ({product_id : product}),
                    beforeSend : function() {
                        if ($(element).hasClass('has-tip')) {
                            $(element).parent().parent().parent()
                                .remove();
                        } else {
                            $(element).parent().parent().find('.status')
                                .addClass('inactive').text($(language).find('data text[id="mystore-products-inactive"] '+lang).text());

                            $('ul#products').find('a[data-product="'+product+'"]').
                                parent().parent().parent().
                                remove();
                        }
                        var elements = $('ul#products div.item');
                        $('ul#products').empty();
                        elements.each(function(index, value){
                            if (index % 5 === 0) $('ul#products').append('<li></li>');
                            $('ul#products li:last').append(value);
                        });

                        var qty = $('.store.totals .box.products').find('h2').text();
                        var numQty = Number(qty)-1;

                        $('.store.totals .box.products').find('h2').text(numQty);
                    },
                    error : function () {
                        if( ! $(element).hasClass('has-tip')) {
                            $(element).parent().parent().find('.status')
                                .removeClass('inactive').text($(language).find('data text[id="mystore-products-active"] '+lang).text());
                        }

                        var qty = $('.store.totals .box.products').find('h2').text();
                        var numQty = Number(qty)+1;

                        $('.store.totals .box.products').find('h2').text(numQty);
                    },
                    success : function () {
                        if( ! $(element).hasClass('has-tip')) {
                            $(element).parent().parent().find('.btn-edit').parent().html('');
                            $(element).parent().html('');
                        }
                    }
                });

            });
        }
    });

    return AllProductsView;
});