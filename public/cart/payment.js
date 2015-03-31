$(function () {

    $.get(base_url+'application/www/language/cart.xml', null, function (data, textStatus) {
        
        if (textStatus == "success") language = data;     

    }, 'xml').done(function(){

        var checked_payment = $(".payment-type input:checked").val();

        if (checked_payment != "paypal" && checked_payment != "boleto")
        {
            checked_payment = 'cartao';
        }
        else
        {
            $('.pagto.cartao input').attr('disabled', 'disabled');
        }

        $('.pagto.'+checked_payment).show();

        if ($("#useaddress").is(":checked")) $('.dadosEntrega input').attr('disabled', 'disabled');

        $('#useaddress').click(function(){

            if($(this).is(':checked')){
                $('.dadosEntrega input').attr('disabled', 'disabled');
                $('form input').removeClass('error');
            }else{
                $('.dadosEntrega input').removeAttr('disabled');
            }

            $('.form-select a').each(function(){
                target = $(this).data('target');

                if (target)
                {
                    if ($("#"+target).is(":disabled"))
                    {
                        $(this).removeClass("active").addClass("disabled");
                    }
                    else
                    {
                        $(this).removeClass("disabled").addClass("active");
                    }
                }
            });
        });

         $('.payment .pagto a.obs').popover({trigger: 'hover'});

         $('.forma-pagto input[type=radio]').click(function() {

            $('.pagto').hide();
            $('.pagto.cartao input').attr('disabled', 'disabled');
            if  ( ($(this).val() == "visa") || ($(this).val() == "master") || ($(this).val() == "amex") ) {
                $('.pagto.cartao').show();
                $('.pagto.cartao input').removeAttr('disabled');
            } else if ($(this).val() == "boleto") {
                $('.pagto.boleto').show();
            } else {
                $('.pagto.paypal').show();
            }

         });

        $('#same-address').on('click', function(){

            if ($(this).prop('checked'))
            {
                $('#billing-info input[type!="checkbox"]').each(function(){
                    $(this).attr('disabled', 'disabled');
                    $('form input').removeClass('error');
                });
            }
            else
            {
                $('#billing-info input[type!="checkbox"]').each(function(){
                    $(this).removeAttr('disabled');
                });
            }

            $('.form-select a').each(function(){
                target = $(this).data('target');

                if (target)
                {
                    if ($("#"+target).is(":disabled"))
                    {
                        $(this).removeClass("active").addClass("disabled");
                    }
                    else
                    {
                        $(this).removeClass("disabled").addClass("active");
                    }
                }
            });
        });

        $('.form-select.month .dropdown').on('click',function(evt)
        {
            tmp_date = new Date('month '+(parseInt($(evt.target).data('id'))+1));
            tmp_date.setDate(0);
            last_day = tmp_date.getDate();

            $('.form-select.day li').each(function()
            {
                var el = $(this).find('a');

                $(this).show();

                if (parseInt(el.data('id')) > last_day)
                {
                    $(this).hide();
                    if ($("#birth-day").val() > last_day)
                    {
                        $('#birth-day').val(last_day);
                        $('.form-select.day .active').html(last_day+"<i class='select-arrow'></i>");
                    }
                }
            });
        });

        /**
         * Validate payment form
         * @author Leonardo Moreira <developer@pleimo.com>
         */
        $("#cart-payment").validate({

            groups: {
                phone : "ddd phone"
            },

            rules : {
                "name" : {
                    required  : true,
                },
                "lastname" : {
                    required  : true,
                },
                "cpf" : {
                    required  : true,
                    cpf : true
                },
                "destinatario" : {
                    required  : true
                },
                "ddd" : {
                    required : true
                },
                "phone"  : {
                    required : true
                },
                "zipCode" : {
                    required : true
                },
                "address" : {
                    required : true
                },
                "number" : {
                    required : true
                },
                "city" : {
                    required : true
                },
                "uf" : {
                    required : true,
                    min : 1
                },
                "billing-zipCode" : {
                    required : true
                },
                "billing-address" : {
                    required : true
                },
                "billing-number" : {
                    required : true
                },
                "billing-city" : {
                    required : true
                },
                "billing-uf" : {
                    required : true,
                    min : 1
                },
                "card-month" : {
                    required : true
                },
                "card-year" : {
                    required : true
                },
                "card-name" : {
                    required : true
                },
                "card-number" : {
                    required : true
                },
                "card-code" : {
                    required : true
                }
            },

            messages : {
                "name" : {
                    required  : null
                },
                "lastname" : {
                    required  : null
                },
                "cpf" : {
                    required  : null
                },
                "destinatario" : {
                    required  : null
                },
                "ddd" : {
                    required : null
                },
                "phone"  : {
                    required : null
                },
                "zipCode" : {
                    required : null
                },
                "address" : {
                    required : null
                },
                "number" : {
                    required : null
                },
                "city" : {
                    required : null
                },
                "uf" : {
                    required : null,
                    min : null
                },
                "billing-zipCode" : {
                    required : null
                },
                "billing-address" : {
                    required : null
                },
                "billing-number" : {
                    required : null
                },
                "billing-city" : {
                    required : null
                },
                "billing-uf" : {
                    required : null,
                    min : null
                },
                "card-month" : {
                    required : null
                },
                "card-year" : {
                    required : null
                },
                "card-name" : {
                    required : null
                },
                "card-number" : {
                    required : null
                },
                "card-code" : {
                    required : null
                }
            },

            showErrors : function() {
                this.defaultShowErrors();
            },

            errorPlacement : function (error, element) {

                if (element.attr('id') == "ddd") error.insertAfter("#phone");

            },

            submitHandler: function() {

                $("#cart-payment .submit").addClass('load').trigger("click");

            }

        });
    });

});