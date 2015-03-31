$(function () {

    $.get(base_url+'application/www/language/dashboard.xml', null, function (data, textStatus) {

        if (textStatus == "success") language = data;

    }, 'xml').done(function(){

        var pleimo = window.pleimo || {};

        var RockInRio = {

            checkout : function() {

                $('span.error').remove();

                if ( ! $('#agree').is(':checked')) {
                    $('label[for="agree"]').after('<span class="error">'+$(language).find('data text[id="promo-rir-rules-required"] '+lang).text()+'</span>');
                    return false;
                }

                $.ajax({
                    type: "POST",
                    url : base_url+"plans/subscribe/popstar",
                    beforeSend : function() {
                        $('.button.promo.save').val('').addClass('loading');
                    },
                    success : function(data) {

                        pleimo.Subscribe = $.parseJSON(data);
                        pleimo.Template.Checkout();

                    }
                });

            },

            save : function () {

                $('span.error').remove();

                if ( ! $('#agree').is(':checked')) {
                    $('label[for="agree"]').after('<span class="error">'+$(language).find('data text[id="promo-rir-rules-required"] '+lang).text()+'</span>');
                    return false;
                }

                $.ajax({
                    type: "POST",
                    url : base_url+"rockinrio/promo",
                    beforeSend : function() {
                        $('.button.promo.save').val('').addClass('loading');
                    },
                    success : function() {
                        $('#rockinrio').addClass('inPromo');
                        $('.promoStatus').text($(language).find('data text[id="promo-rir-banner-2-inpromo"] '+lang).text());
                        closeMask();
                    }
                });

            },

            rules : function () {

                openMask();

                $('.rockinrio-artist').hide();

                $.get(base_url+'application/www/views/dashboard/modal-rir-rules.tpl', {}, function( data ) {
                    $("body").append(data);
                });

            }
        }

        pleimo.RockInRio = RockInRio;

        $(document).ready(function() {

            $('.button.promo.save').click(function(e){

                if (pleimo.Dashboard.Subscription.ID_SUBSCRIPTION_STATUS != 1)
                    return pleimo.RockInRio.checkout();

                return pleimo.RockInRio.save();

            });

            $('a.rules').click(function(e){
                pleimo.RockInRio.rules();
            });

            $(document).on("click", ".rockinrio-rules a.button.rules", function(e){
                $('.rockinrio-rules').remove();
                $('.rockinrio-artist').show();
            });
        });

        window.pleimo = pleimo;
    });

});
