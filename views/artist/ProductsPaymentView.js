define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone'),
        ContentFactory  = require('views/ContentFactory');

    var viewFactory = new ContentFactory();

    var base_url = window.base_url;

    var ProductsPaymentView = Backbone.View.extend({
        el: $("#product-image"),

        cartModal: function() {
            viewFactory.createView('cartModal');
        },

        render: function() {
            var that = this;
            $('#payment-tab input[type=radio]').click(function() {
                $('.pagto').hide();
                if  ( ($(this).val() == "visa") || ($(this).val() == "master") ) {
                    $('.pagto.cartao').show();
                } else if ($(this).val() == "boleto") {
                    $('.pagto.boleto').show();
                } else {
                    $('.pagto.paypal').show();
                }
            });

            var checked_payment = $(".payment-type input:checked").val();

            if (checked_payment != "paypal" && checked_payment != "boleto")
            {
                checked_payment = 'cartao';
            }

            $('.pagto.'+checked_payment).show();

            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                if ( $(e.target).attr('href') == '#comment-tab' ) {
                    commentTab.init();
                }
            });

            $("a.button.btn-cart").one("click", function(){
                send.Purchase($(this));
            });

            var commentTab = {

                _initialized: false,

                init: function() {

                    if (!this._initialized) {

                        this._initialized = true;

                        $('#comment-tab ul').carouFredSel({
                            width: '718px',
                            scroll: 1,
                            prev: '#comment-prev',
                            next: '#comment-next',
                            auto: false,
                            items: {
                                visible: {
                                    min: 3
                                }
                            },
                            infinite: false,
                            circular: false
                        });

                    }

                }
            };

            var send = {

                "Purchase" : function(object){

                    console.log('purchase xx');

                    $.ajax({
                        type : "POST",
                        data : ({'artist_product' : $('#artist_product').val(),
                            'product'        : $('#product').val(),
                            'artist'         : $('#artist').val(),
                            'thumbnails'     : $('#thumbnails').val(),
                            'name'           : $('#name').val() + ": " +$('#artist_name').val(),
                            'description'    : $('#description').val(),
                            'price'          : $('#price').val(),
                            'quantity'       : $('#qty').val(),
                            'weight'         : $('#weight').val(),
                            'recurrent'      : $('#recurrent').val(),
                            'size'           : $('input[name=size]:checked').val(),
                            'pay_method'     : $('input[name=forma]:checked').val()}),
                        url  : base_url+"cart/add"
                    }).done(function(data, status, response){

                        //trigger cart status
                        $("#cart-qty").trigger("cartEvent",1,1);

                        if (response.status == 200)
                        {
                            $('.outbox').remove();
                            if ($('.zoomContainer').length > 0)
                            {
                                $('.zoomContainer').remove();// remove zoom container from DOM
                            }

                            that.cartModal();
                        }
                    });

                }

            };


        }



    });


    return ProductsPaymentView;
});
