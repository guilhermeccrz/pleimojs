(function($, window) {

    /**
     * Pleimo namespace
     * @namespace pleimo
     */
    var pleimo = window.pleimo || {};

    $.get(base_url+'application/www/language/coupon.xml', null, function (data, textStatus) {
        if (textStatus == "success") pleimo.Language = { Coupon : data };
    }, 'xml').done(function(){

        $(".subscription-payment .coupon-check").click(function(){
            pleimo.Checkout.Coupon.Pull();
        });

    });

    /**
     * @namespace
     * @alias pleimo.coupon
     */
    pleimo.Checkout.Coupon = {

        /**
         * @author Leonardo Moreira <developer@pleimo.com>
         * @method
         * @alias pleimo.Checkout.Coupon.Push
         */
        "Pull" : function() {

            $.ajax({
                type : "POST",
                data : { "coupon" : $("#coupon-hash").val() },
                url  : base_url+"coupon/get",

                beforeSend : function() {
                    $(".subscription-payment .coupon .alert").remove();
                    $(".subscription-payment .coupon .coupon-check").addClass('wait').val(null);
                },

                success : function(data)
                {
                    data   = $.parseJSON(data);
                    coupon = data.coupon;

                    if (data.message) {
                        pleimo.Checkout.Coupon.Error(data);
                    }

                    if ( ! data.message) {
                        pleimo.Checkout.Coupon.Push(coupon);
                    }
                }
            });

        },

        /**
         * @author Leonardo Moreira <developer@pleimo.com>
         * @method
         * @alias pleimo.Checkout.Coupon.Push
         */
        "Push" : function(data) {

            $price = (pleimo.Subscribe.PRICE - data.PRICE).toFixed(2);

            if ($price < 0)
                $price = (0.00).toFixed(2);

            $(".subscription-payment .offer b").html($price);
            $(".subscription-payment .coupon .coupon-check").remove();

        },

        /**
         * @author Leonardo Moreira <developer@pleimo.com>
         * @method
         * @alias pleimo.coupon.Error
         */
        "Error" : function(data) {

            $(".subscription-payment .coupon .coupon-check").removeClass('wait').val($(pleimo.Language.Coupon).find('data text[id="coupon-save"] '+lang).text());
            $(".subscription-payment .coupon .pagto p").append("<div class=\"alert alert-warning\"><span>"+data.message+"</span></div>");

        }

    }

    window.pleimo = pleimo;

})(jQuery, window);