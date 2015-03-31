$(function () {

    $.get(base_url+'application/www/language/cart.xml', null, function (data, textStatus) {
        
        if (textStatus == "success") language = data;     

    }, 'xml').done(function(){


        $( ".forma-pagto" ).accordion({active: false, collapsible: true, header: "h4", heightStyle: "content"});

        $('.pagto.cartao input').attr('disabled', 'disabled');

        $('h4').on('click',function(e){
            header = $(e.target);

            $('input[name="forma"]').val(header.data('payment'));

            $('.pagto.cartao input').attr('disabled', 'disabled');
            header.next().find('input').removeAttr('disabled');
        });

        $("#birthdate").mask("99/99/9999");
        $("#cpf").mask("999.999.999-99");

        /**
         * Validate payment form
         * @author Leonardo Moreira <developer@pleimo.com>
         */
        $("#crowd-payment").validate({

            groups: {
                phone : "ddd phone"
            },

            rules : {
                "birthdate" : {
                    required  : true
                },
                "cpf" : {
                    required  : true,
                    cpf : true
                },
                "forma" : {
                    required : true
                },
                "visa-billing-zipCode" : {
                    required : true
                },
                "visa-billing-address" : {
                    required : true
                },
                "visa-billing-number" : {
                    required : true
                },
                "visa-billing-city" : {
                    required : true
                },
                "visa-billing-uf" : {
                    required : true,
                    min : 1
                },
                "visa-card-month" : {
                    required : true
                },
                "visa-card-year" : {
                    required : true
                },
                "visa-card-name" : {
                    required : true
                },
                "visa-card-number" : {
                    required : true
                },
                "visa-card-code" : {
                    required : true
                },
                "master-billing-zipCode" : {
                    required : true
                },
                "master-billing-address" : {
                    required : true
                },
                "master-billing-number" : {
                    required : true
                },
                "master-billing-city" : {
                    required : true
                },
                "master-billing-uf" : {
                    required : true,
                    min : 1
                },
                "master-card-month" : {
                    required : true
                },
                "master-card-year" : {
                    required : true
                },
                "master-card-name" : {
                    required : true
                },
                "master-card-number" : {
                    required : true
                },
                "master-card-code" : {
                    required : true
                }
            },

            messages : {
                "birthdate" : {
                    required  : null
                },
                "cpf" : {
                    required  : null,
                    cpf : null
                },
                "forma" : {
                    required : true
                },
                "visa-billing-zipCode" : {
                    required : null
                },
                "visa-billing-address" : {
                    required : null
                },
                "visa-billing-number" : {
                    required : null
                },
                "visa-billing-city" : {
                    required : null
                },
                "visa-billing-uf" : {
                    required : null,
                    min : null
                },
                "visa-card-month" : {
                    required : null
                },
                "visa-card-year" : {
                    required : null
                },
                "visa-card-name" : {
                    required : null
                },
                "visa-card-number" : {
                    required : null
                },
                "visa-card-code" : {
                    required : null
                },
                "master-billing-zipCode" : {
                    required : null
                },
                "master-billing-address" : {
                    required : null
                },
                "master-billing-number" : {
                    required : null
                },
                "master-billing-city" : {
                    required : null
                },
                "master-billing-uf" : {
                    required : null,
                    min : null
                },
                "master-card-month" : {
                    required : null
                },
                "master-card-year" : {
                    required : null
                },
                "master-card-name" : {
                    required : null
                },
                "master-card-number" : {
                    required : null
                },
                "master-card-code" : {
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

                $(".content-loading").show();

                $.ajax({
                    type : "POST",
                    data : $("#crowd-payment").serialize(),
                    url  : base_url+$("#crowd-payment .submit").data('href'),
                    dataType: "json"
                }).done(function(data)
                {
                    if ( ! data.message ) {
                        window.top.location = base_url+data.redirect;
                    }
                });

            }

        });
    });

});