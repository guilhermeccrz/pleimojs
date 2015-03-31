$(function(){

    var pleimo = window.pleimo || {};

    $.get(base_url+'application/www/language/geteasy.xml',{}, function (data, textStatus){

        
        if (textStatus == "success") {
            pleimo.Language = { "geteasy" : data };
        }

    },'xml').done(function(){  pleimo.Geteasy.Payment.Init(); });


    pleimo.Geteasy.Payment = {

        "Init":function()
        {

            $.data(document.body, "type", "streamer");

            $("#paypal-submit").bind("click",function(){
                $("#paypal-submit").addClass('wait').val(null);
               pleimo.Geteasy.Payment.Submit()
            });

            $('.plans-type').each(function(){
                $(this).on("click",function(){
                    $.data(document.body, "type", $(this).data("utype"));
                });
                
            });

        },

        
        "Submit":function()
        {
            $.ajax({
                "type" : "POST",
                "url"  : base_url+"geteasy/send-data",
                "dataType": "json",
                "data":
                {
                    "type" : $.data(document.body, "type")
                },
                success : function(data)
                {
                    if (0 == data.success) {
                        pleimo.Geteasy.Modal.load(pleimo.Geteasy.Modal.geteasy, "geteasy/voucher_invalid_modal", true);
                        return false;
                    }

                    pleimo.Geteasy.Payment.Checkout();
                }
            });

        },

        "Checkout" : function ()
        {
            $.ajax({

                type : "POST",
                url  : base_url+"checkout/process",
                dataType: "json",
                success : function(data)
                {
                    if (data.ACK === "Success")
                        window.top.location = data.REDIRECT + data.TOKEN;
                }
            });
        },

        "Modal" : {
            payment : null,

            load : function( object, url, autoOpen )
            {
                self = pleimo.Geteasy.Modal;

                $.ajax({
                    type : "GET",
                    url  : base_url+url
                }).done(function(data) {
                    if (data != "false")
                    {
                        object = $(data);

                        if (autoOpen)
                            pleimo.Geteasy.Payment.Open(object);
                    }
                });
            }
        },

        "Open" : function( modal_object )
        {
            if (undefined == modal_object)
                return false;

            $('.modal').remove();
            openMask();

            $('body').append(modal_object);

            $("#amount").on('keyup', function(e){
                amount = parseFloat($("#amount").val().replace(".","").replace(",","."));
                if (amount > 0)
                {
                    $("#amount").removeClass('error');
                }
                else
                {
                    $("#amount").addClass('error');
                }
            });
            
        }

    }

    window.pleimo = pleimo;

});// END