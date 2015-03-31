$(function(){


    var pleimo = window.pleimo || {};



    $.get(base_url+'application/www/language/geteasy.xml',{}, function (data, textStatus){

        
        if (textStatus == "success") {
            pleimo.Language = { "geteasy" : data };
        }

    },'xml').done(function(){  pleimo.Geteasy.Init(); });


    pleimo.Geteasy = {

        "Init":function()
        {
            $("#voucher-submit").bind("click",function(){ 
                $(this).css("height","18").addClass('wait').html(null);
                pleimo.Geteasy.Submit() 
            });
        },
        
        "Submit":function()
        {
           

            var voucher = $("#voucher").val();
        
            if(undefined == voucher || voucher == '' || voucher == $("#voucher").attr('placeholder'))
            {
                pleimo.Geteasy._error();
                return false;
            }

            if ( ! pleimo.Session.ID_USER)
            {

                pleimo.Geteasy.Voucher = true;
                pleimo.Template.Signin();
                $("#voucher-submit").
                removeClass('wait').
                html($(pleimo.Language.geteasy).
                    find('data text[id="geteasy-voucher-submit-button"] '+lang).
                    text());
                return false;
            }

            pleimo.Geteasy.voucher_validation(voucher, function(data) {
                 
                if (0 == data.success)
                    return pleimo.Geteasy.Modal.load(pleimo.Geteasy.Modal.geteasy, "geteasy/voucher_invalid_modal", true);

                pleimo.Geteasy.Voucher = data;
                pleimo.Geteasy.Checkout();
            
            });
        },

        "Modal" : {

            load : function( object, url, autoOpen )
            {
                self = pleimo.Geteasy.Modal;

                $.ajax({
                    type : "POST",
                    url  : base_url+url
                }).done(function(data) 
                {
                    
                    if (data == "false")
                    {
                        return false;
                    }

                    if (autoOpen)
                    {
                        var object = $(data);
                        pleimo.Geteasy.Open(object);
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
            $("#voucher-submit").removeClass('wait').html($(pleimo.Language.geteasy).find('data text[id="geteasy-voucher-submit-button"] '+lang).text());
        },

        "voucher_validation":function(voucher, callback){
            $.ajax({

                "type" : "POST",
                "url"  : base_url+"geteasy/voucher-validation",
                "dataType": "json",
                "data":
                {
                    "voucher":voucher
                },
                "success":function(data)
                {
                    
                    if(undefined == callback)
                        return false;
                    
                    return callback(data);
                } 
            });
        },

        "Checkout":function()
        {
            return pleimo.Geteasy.Modal.load(pleimo.Geteasy.Modal.geteasy,"geteasy/payment_modal", true);  
        },

        "_error":function(){
            
            $("#voucher-submit").
            removeClass('wait').
            html($(pleimo.Language.geteasy).
                find('data text[id="geteasy-voucher-submit-button"] '+lang).
                text());

            $("#voucher").
            css('background-color','#FFE5E5').
            css('border-color','#FF0000');
            
            $("#voucher").css('position','relative');

            for(var iter=0;iter<(4+1);iter++)
            {
                $("#voucher").animate({ left: ((iter%2==0 ? 10 : 10*-1))}, 50);
            }//for

            $("#voucher").animate({ left: 0},50);

            $("#voucher").on('change', function(e){

                var voucher = ($(this).val()).length;
                
                if (voucher >=32)
                {
                    $("#voucher").
                    css('background-color','#f5f5f5').
                    css('border-color','#dcdcdc');
                }

            });
        }



    }


    window.pleimo = pleimo;

});// END