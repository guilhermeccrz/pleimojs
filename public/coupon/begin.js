(function($, window) {

    /**
     * Pleimo namespace
     * @namespace pleimo
     */
    var pleimo = window.pleimo || {};

    /**
     * Get current currency.
     * @author Leonardo Moreira <developer@pleimo.com>
     * @type {string}
     */
    var $currency = $("#cart-currency").val();

    $.get(base_url+'application/www/language/coupon.xml', null, function (data, textStatus) {

        if (textStatus == "success") language = data;

    }, 'xml').done(function(){

        /**
         * Validate cart form.
         * @author Leonardo Moreira <developer@pleimo.com>
         */
        $("#form-coupon").validate({

            rules : {
                "coupon-hash" : {
                    required  : true
                }
            },

            messages : {
                "coupon-hash" : {
                    required  : null
                }
            },

            showErrors : function() {
                this.defaultShowErrors();
            },

            submitHandler: function() {

                $("#form-coupon .alert").remove();
                $("#form-coupon .submit").addClass('wait').val(null);

                $.ajax({
                    type : "POST",
                    data : { "coupon" : $("#coupon-hash").val() },
                    url  : base_url+"coupon/get"
                }).done(function(data){

                    data   = $.parseJSON(data);
                    coupon = data.coupon;

                    if (data.message) {
                        pleimo.coupon.Error(data);
                    }

                    if ( ! data.message) {
                        pleimo.coupon.Set(coupon);
                    }

                });

            }

        });

    });

    /**
     * @namespace
     * @alias pleimo.coupon
     */
    pleimo.coupon = {

        /**
         * @author Leonardo Moreira <developer@pleimo.com>
         * @method
         * @alias pleimo.coupon.Set
         */
        Set : function(data) {

            $("#cart-form #cart-coupon").val(data.HASH);
            $("#cart-form #cart-coupon-value").val(data.PRICE);

            $("#cart-form #cart-coupon").trigger('change');
            $("#cart-form #cart-coupon-value").trigger('change');

            $(".cart-total .coupon").html($(language).find('data text[id="coupon-value"] '+lang).text() + " <strong>" + $currency + data.PRICE + "</strong>");

            closeMask();

        },

        /**
         * @author Leonardo Moreira <developer@pleimo.com>
         * @method
         * @alias pleimo.coupon.Error
         */
        Error : function(data) {

            $("#form-coupon").prepend("<div class=\"alert alert-warning\"><span>"+data.message+"</span></div>");
            $("#form-coupon .submit").removeClass('wait').val($(language).find('data text[id="coupon-save"] '+lang).text());

        }

    }

    window.pleimo = pleimo;

})(jQuery, window);