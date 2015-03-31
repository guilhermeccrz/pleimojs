$(function () {

    $.get(base_url+'application/www/language/forgot.xml', null, function (data, textStatus) {

        if (textStatus == "success") language = data;

    }, 'xml').done(function(){

        $("#form-remember").validate({

            errorElement: "span",

            rules : {
                "passwd" : {
                    required : true
                },
                "cpasswd" : {
                    equalTo : "#passwd"
                }
            },

            messages : {
                "passwd" :{
                    required : null
                },
                "cpasswd" : {
                    required : null,
                    equalTo  : null
                }
            }

        });

    });
});