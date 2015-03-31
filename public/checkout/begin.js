$(function () {

    var pleimo = window.pleimo || {};

    $.get(base_url+'application/www/language/crowd.xml', null, function (data, textStatus) {

        if (textStatus == "success") pleimo.Language = { Checkout : data };

    }, 'xml').done(function(){

        pleimo.Checkout.Init();

        $(".subscription-payment .open-coupon").click(function(){
            pleimo.Checkout.ShowCoupon();
        });

    });

    /**
     * @author Leonardo Moreira <developer@pleimo.com>
     * @type {{Open: Function}}
     */
    pleimo.Checkout = {

        "Init" : function()
        {
            $(".subscription-payment .submit").click(function(){
                $(this).addClass('wait').val(null);
                pleimo.Checkout.Submit();
            });
        },

        "ShowCoupon" : function()
        {
            $(".subscription-payment .coupon").show();
        },

        "Submit" : function () 
        {
            $.ajax({

                type : "POST",
                url  : base_url+"checkout/process",
                dataType: "json",
                success : function(data)
                {
                    if (data.ACK === "Success")
                        return window.top.location = data.REDIRECT + data.TOKEN;

                    $(".subscription-payment .submit").
                    removeClass('wait').
                    html($(pleimo.Language.geteasy).
                        find('data text[id="geteasy-voucher-submit-button"] '+lang).
                        text());

                }
            });
        }

    }

    window.pleimo = pleimo;

});