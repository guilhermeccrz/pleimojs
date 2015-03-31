$(function () {

    $.get(base_url+'application/www/language/signup.xml', null, function (data, textStatus) {

        if (textStatus == "success") language = data;

    }, 'xml').done(function(){

        /**
         * Validate signup form.
         * @author Leonardo Moreira <developer@pleimo.com>
         */
        $("#form-register").validate({

            rules : {
                "signup-name" : {
                    required: true
                },
                "signup-email" : {
                    required : true,
                    email    : true
                },
                "signup-passwd" : {
                    required : true
                }
            },

            messages : {
                "signup-name" : {
                    required: null
                },
                "signup-email" : {
                    required : null,
                    email    : null
                },
                "signup-passwd" : {
                    required : null
                }
            },

            showErrors : function() {
                this.defaultShowErrors();
            },

            submitHandler: function() {

                if ($("#signup-terms:checked").val() != 1) {
                    $("#read-terms").css("color", "#E70F47");
                    return false;
                } else {
                    $("#read-terms").css("color", "#424242");
                }

                $("#form-register .alert").remove();
                $("#form-register .submit").addClass('wait').val(null);

                $.ajax({
                    type : "POST",
                    data : { "name" : $("#signup-name").val(), "email" : $("#signup-email").val(), "passwd" : $("#signup-passwd").val(), "redirect" : $("#signup-redirect").val() },
                    url  : base_url+"signup/create"
                }).done(function(data){

                    data = $.parseJSON(data);
                    
                    pleimo.Session = data.session;

                    if (data.message) {
                        $("#form-register").prepend("<div class=\"alert alert-warning\"><span>"+data.message+"</span></div>");
                        $("#form-register .submit").removeClass('wait').val("Cadastrar");
                    }

                    if (pleimo.Subscribe) {
                        pleimo.Template.Subscribe(pleimo.Subscribe);
                        return false;
                    }

                    if (pleimo.Geteasy != undefined && pleimo.Geteasy.Voucher == true)
                    {
                        pleimo.Geteasy.Submit();
                        return false;
                    }

                    if ( ! data.message )
                    {
                        $.ajax({
                            type: "POST",
                            url : base_url+"plans/subscribe/freemium",
                            beforeSend : function() {
                                $('.button.promo.save').val('').addClass('loading');
                            },
                            success : function(data) {

                                pleimo.Subscribe = $.parseJSON(data);
                                pleimo.Template.Checkout();

                            }
                        });
                    }

                });

            }

        });

    });

});