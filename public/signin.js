$(function () {

    $.get(base_url+'application/www/language/signin.xml', null, function (data, textStatus) {

        if (textStatus == "success") language = data;

    }, 'xml').done(function(){ 

        /**
         * Validate signin form.
         * @author Leonardo Moreira <developer@pleimo.com>
         */
        $("#form-login").validate({

            rules:{
                "signin-email" : {
                    required : true,
                    email    : true
                },
                "signin-passwd" : {
                    required : true
                }
            },

            messages:{
                "signin-email" :{
                    required : null,
                    email    : null
                },
                "signin-passwd" : {
                    required  : null,
                    minlength : 3
                }
            },

            showErrors : function() {
                this.defaultShowErrors();
            },

            submitHandler: function() {

                $("#form-login .alert").remove();
                $("#form-login .submit").addClass('wait').val(null);

                if ( ! $("#signin-redirect").val()) $("#signin-redirect").val(window.location.pathname);

                $.ajax({
                    type : "POST",
                    data : { "email" : $("#signin-email").val(), "passwd" : $("#signin-passwd").val(), "redirect" : $("#signin-redirect").val() },
                    url  : base_url+"signin/auth"
                }).done(function(data){

                    data = $.parseJSON(data);

                    pleimo.Session = data.session;

                    if (data.message) {
                        $("#form-login").prepend("<div class=\"alert alert-warning\"><span>"+data.message+"</span></div>");
                        $("#form-login .submit").removeClass('wait').val($(language).find('data text[id="login-login"] '+lang).text());

                        return false;
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
                        window.top.location = base_url+data.redirect;

                });

            }

        });

        /**
         * Validate remember form.
         * @author Leonardo Moreira <developer@pleimo.com>
         */
        $("#form-remember").validate({

            rules:{
                "email-remember" : {
                    required : true,
                    email    : true
                }
            },

            messages:{
                "email-remember" : {
                    required : null,
                    email    : null
                }
            },

            showErrors : function() {
                this.defaultShowErrors();
            },

            submitHandler: function() {

                $("#form-remember .alert").remove();
                $("#form-remember .submit").addClass('wait').val(null);

                $.ajax({
                    type : "POST",
                    data : { "email-remember" : $("#email-remember").val() },
                    url  : base_url+"forgot/send"
                }).done(function(data){

                    data = $.parseJSON(data);

                    if (data.status == "1") $("#form-remember").prepend("<div class=\"alert alert-success\"><span>"+data.message+"</span></div>");
                    if (data.status == "0") $("#form-remember").prepend("<div class=\"alert alert-warning\"><span>"+data.message+"</span></div>");

                    $("#form-remember .submit").removeClass('wait').val($(language).find('data text[id="text-send"] '+lang).text());

                });

            }

        });

    });

});