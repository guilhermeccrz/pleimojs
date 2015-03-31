$(function () {

    $.get(base_url+'application/www/language/profile_settings.xml', null, function (data, textStatus) {

        if (textStatus == "success") language = data;

    }, 'xml').done(function(){

            /** form register validate */
            $("#form-passwd").validate({

                errorElement: "span",

                rules:{
                    "opassword" : {
                        required: true,
                        remote  : {
                            url : base_url+'settings/check_pass',
                            type: "post"
                        }
                    },
                    "npassword" : {
                        required: true
                    },
                    "cpassword" : {
                        required: true,
                        equalTo : '#npassword'
                    }
                },

                messages:{
                    "opassword" : {
                        required: $(language).find('data text[id="settings-password-error-required"] '+lang).text(),
                        remote  : $(language).find('data text[id="settings-password-not-found"] '+lang).text()
                    },
                    "npassword" : {
                        required: $(language).find('data text[id="settings-password-error-required"] '+lang).text()
                    },
                    "cpassword" : {
                        required: $(language).find('data text[id="settings-password-error-required"] '+lang).text(),
                        equalTo : $(language).find('data text[id="settings-password-equal-error"] '+lang).text()
                    }
                },

                success: function() {
                    errors = false;
                },

                invalidHandler: function(form, validator) {
                    errors = true;
                },

                submitHandler: function(form) {

                    $("#form-passwd .submit").addClass('load').trigger("click");

                }

            });

        });
});