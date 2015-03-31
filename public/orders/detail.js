$(function () {

    pleimo.Orders = {
        "Modal" : {
            cancel : null,
            load : function(object, url, autoOpen)
            {
                $.post(base_url+url, function(data){
                    pleimo.Orders.Modal[object] = $(data);

                    if (autoOpen)
                    {
                        pleimo.Orders.Open(pleimo.Orders.Modal[object]);
                    }
                    else
                    {
                        $(document).trigger("modalReady");
                    }
                });
            },
            close : function()
            {
                $(".modal").remove();
                closeMask();
            }

        },
        "Init" : function (){
            pleimo.Orders.Modal.load("cancel", "orders/cancel_dialog");

            $(document).on("modalReady", function(){

                $(document).off("modalReady");

                //console.log(pleimo.Orders.Modal.cancel);

                $(document).find('.order-cancel .btn-yes').on('click', function(){

                    var data_id = $(".button.cancel").data('id');

                    $(this).addClass('wait').html('');

                    $.ajax({
                        type: 'POST',
                        data: { 'order_id' : data_id },
                        url: base_url+'orders/cancel'
                    }).done(function(data){
                        $.ajax({
                            type: 'POST',
                            data: { 'order_id' : data_id },
                            url: base_url+'orders/get_status_logs'
                        }).done(function(data){
                            $(".modal").remove();
                            closeMask();
                            $(".logs").html(data);
                        });
                    });
                });

                $(document).on('click',".btn-no", function(){
                    pleimo.Orders.Modal.close();
                });

                $('.button.cancel').on('click', function(){
                    pleimo.Orders.Open(pleimo.Orders.Modal.cancel);
                });

            });

            $('.button.payment').on('click', function(){
                var data_id = $(this).data('id');

                $(".content-loading").show();

                $.ajax({
                    url: base_url+"orders/payment",
                    type: "POST",
                    dataType: "json",
                    data: {"order_id":data_id}
                }).done(function(data){
                    if (data.redirect)
                    {
                        History.pushState(null, null, base_url+data.redirect);
                        pleimo.Template.Controller(data.redirect);
                    }
                    else
                    {
                        $(".content-loading").hide();
                    }
                });
            });
        },
        "Open" : function( object ) {
            $(".modal").remove();
            openMask();

            $("body").append(object.clone());
        }
    };

    pleimo.Orders.Init();

});