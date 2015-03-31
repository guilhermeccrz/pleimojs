$(function () {

    var pleimo = window.pleimo || {};

    $.get(base_url+'application/www/language/cart.xml', null, function (data, textStatus) {

        if (textStatus == "success") pleimo.Language = data;

    }, 'xml').done(function(){

        /**
         * Check if all products in shopping cart is only recurrent purchase.
         *
         * @author Leonardo Moreira <developer@pleimo.com>
         */
        if ($.inArray("0", pleimo.Cart.Recurrent()) == "-1") {
            $(".zipcode, .obs, .btn-calcfrete, .btn-frete").remove();
        }

        /**
         * If exists products in shopping cart, update total and show on header count.
         *
         * @author Leonardo Moreira <developer@pleimo.com>
         */
        if ($(".cart-table > tbody  > tr[data-product]").length > 0) pleimo.Cart.Total();

        /**
         * Remove shopping cart product.
         *
         * @author Leonardo Moreira <developer@pleimo.com>
         * @see {cart.Remove()}
         */
        $(".btn-remover").click(function(e){
            pleimo.Cart.Remove($(this));
        });

        /**
         * Add product qty.
         *
         * @author Leonardo Moreira <developer@pleimo.com>
         * @see {{cart.Remove()}}
         */
        $(".plus").click(function(e){
            pleimo.Cart.Plus($(this));
        });

        /**
         * Add product qty.
         *
         * @author Leonardo Moreira <developer@pleimo.com>
         * @see {{cart.Remove()}}
         */
        $(".minus").click(function(e){
            pleimo.Cart.Minus($(this));
        });

        /**
         * Calc freight tax.
         *
         * @author Leonardo Moreira <developer@pleimo.com>
         * @see {{cart.Zipcode()}}
         */
        $(".btn-calcfrete").click(function(e){
            if ($.inArray("0", cart.Recurrent()) != "-1") pleimo.Cart.Zipcode();
        });

        /**
         * Open modal to insert gift coupon hash.
         *
         * @author Leonardo Moreira <developer@pleimo.com>
         * @see {cart.Remove()}
         */
        $(".btn-coupon").click(function(e){
            pleimo.Cart.Coupon($(this));
        });

        /**
         * Apply coupon discount.
         *
         * @author Leonardo Moreira <developer@pleimo.com>
         * @see {cart.Total()}
         */
        $("#cart-coupon").change(function() {
            pleimo.Cart.Total();
        });

        /*
         $('#suggest-carousel').carouFredSel({
         width  : '840px',
         scroll : 1,
         prev   : '#similar-prev',
         next   : '#similar-next',
         auto   : false,
         items  : {
         visible: {
         min: 5
         }
         }
         });
         */

        /**
         * Validate cart form.
         * @author Leonardo Moreira <developer@pleimo.com>
         */
        $("#cart-form").validate({

            rules : {
                "zip-code" : {
                    required  : true,
                    minlength : 8
                },
                "cart-tax" : {
                    required : true
                },
                "cart-subtotal" : {
                    required : true
                },
                "cart-total" : {
                    required : true
                }
            },

            messages : {
                "zip-code" : {
                    required  : null,
                    minlength : null
                }
            },

            showErrors : function() {
                this.defaultShowErrors();
            },

            errorPlacement: function (error, element) {
                error.insertAfter("#zip-code");
            },

            submitHandler: function() {
                $("#cart-zipcode").val($('#zip-code').val());
                if ($("#cart-tax").val() != "0.00" || $.inArray("0", cart.Recurrent()) == "-1") $("#cart-form .submit").addClass('load').trigger("click");
            }

        });

    });

    /**
     * Get current currency.
     * @author Leonardo Moreira <developer@pleimo.com>
     */
    var $currency = $("#cart-currency").val();

    /**
     * @author Leonardo Moreira <developer@pleimo.com>
     * @type {{Update: Function, Remove: Function, Total: Function, Zipcode: Function, Recurrent: Function}}
     */
    var cart = {

        "Update" : function(product, qty) {

            var $product   = product;
            var $price     = $("#product-" + $product + "-price");
            var $recurrent = $("#product-" + $product + "-recurrent");
            var $subtotal  = ($price.val()*qty).toFixed(2);

            if (qty > 0)
            {
                $("#product-" + $product + "-subtotal").val($subtotal);
                $("table").find("tr[data-product='" + $product + "']").find('.subtotal').html($currency + " " + $subtotal);

                pleimo.Cart.Total();
                if ($recurrent.val() != "1") pleimo.Cart.Zipcode();

                $.ajax({
                    type: "POST",
                    url: base_url+"cart/update",
                    data: { product : $product, qty : qty }
                });
            }

        },

        "Remove" : function(object) {

            var $product = object.data('product');

            $("table").find("tr[data-product='" + $product + "'] .qty a.btn-remover").removeClass('icon').html("<img src='"+base_url+"templates/pleimo-s3/pleimo-assets/images/ajax-loader-little.gif' />");

            $.ajax({
                type: "POST",
                url: base_url+"cart/remove",
                data: { product : $product }
            }).done(function(){

                var $products = $(".cart-table > tbody  > tr[data-product]");

                if ($products.length <= 1) {
                    pleimo.Template.Controller('cart');
                    return false;
                }

                if ($.inArray("0", cart.Recurrent()) == "-1") {

                    $("#cart-tax").val("0.00");
                    $("#cart-tax-days").val("0");

                    $(".zipcode, .obs, .btn-calcfrete, .btn-frete").remove();

                }

                $("table").find("tr[data-product='" + $product + "']").remove();

                pleimo.Cart.Total();
            });

        },

        "Total" : function() {

            var $tax = $("#cart-tax").val();
            var $coupon = $("#cart-coupon-value").val();
            var $qty = 0;
            var $subtotal = 0;

            var $products = $(".cart-table > tbody  > tr[data-product]");

            $.each($products, function() {

                var $item = $(this).data('product');

                $qty += parseFloat($("#product-" + $item + "-qty").val());
                $subtotal +=  parseFloat($("#product-" + $item + "-subtotal").val());

            });

            $("nav.cart .cart-qty").html($qty);

            var $cart_subtotal = $subtotal.toFixed(2);
            if ($coupon != "0.00") $cart_subtotal = ($cart_subtotal - parseFloat($coupon)).toFixed(2);
            if ($cart_subtotal < 0.00) $cart_subtotal = (0.00).toFixed(2);

            var $cart_total    = ($tax) ? (parseFloat($cart_subtotal) + parseFloat($tax)).toFixed(2) : $cart_subtotal;

            $("#cart-subtotal").val($cart_subtotal);
            $("#cart-total").val($cart_total);

            if ($tax) $(".cart-total").find('.valorCep').html($currency + " " + parseFloat($tax).toFixed(2));

            $(".cart-total").find('.parcial').html($currency + " " + $cart_subtotal);
            $(".cart-total").find('.soma').html($currency + " " + $cart_total);

        },

        "Zipcode" : function() {

            var $zipcode        = $('#zip-code').val();
            var $successZipCode = $(pleimo.Language).find('data text[id="cart-summary-time"] '+lang).text();
            var $errorZipCode   = $(pleimo.Language).find('data text[id="cart-summary-error-zipcode"] '+lang).text();

            $(".cart-total .frete .obs").html('');

            $.ajax({
                type: "POST",
                url: base_url+"cart/zipcode",
                data: { zipcode : $zipcode, weight : "0.100" }
            }).done(function(data){

                data = $.parseJSON(data);

                if (data !== false)
                {
                    if (data.Valor) data.Valor = data.Valor.replace("," , ".");

                    $("#cart-tax").val(data.Valor);

                    var $response = $(".cart-total .frete .obs");

                    var day      = parseInt(data.PrazoEntrega)+10;
                    var deadline = parseInt(day)+5;

                    $successZipCode = $successZipCode.replace('[[MINDAYS]]', day).replace('[[MAXDAYS]]', deadline);

                    $("#cart-tax-days").val(data.PrazoEntrega);
                    (data.Erro == 0) ? $response.html($successZipCode) : $response.html($errorZipCode);

                    pleimo.Cart.Total();
                }
            });

        },

        "Coupon" : function() {

            openMask();

            $.ajax({
                type : "POST",
                url  : base_url+"coupon"
            }).done(function(data) {
                $("body").append(data);
            });

        },

        "Recurrent" : function()
        {
            var recurrent = new Array();
            var $products = $(".cart-table > tbody  > tr[data-product]");

            $.each($products, function() {

                var $item = $(this).data('product');
                var $recurrent =  $("#product-" + $item + "-recurrent").val();

                recurrent.push($recurrent);

            });

            return recurrent;
        },

        "Plus" : function(object) {

            var $products = object.data('product');
            var $field    = $("#product-" + $products + "-qty");

            var val = parseInt($field.val());
            val += 1;
            $field.val(val);

            cart.Update($products, val);
        },

        "Minus" : function(object) {

            var $products = object.data('product');
            var $field    = $("#product-" + $products + "-qty");

            var val = parseInt($field.val());
            val -= 1;

            if (val > 0) {
                $field.val(val);
            }

            cart.Update($products, val);
        }

    }

    /** @namespace pleimo.Cart */
    pleimo.Cart = cart;

    window.pleimo = pleimo;

});