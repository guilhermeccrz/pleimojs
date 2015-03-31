$(function () {

    $.get(base_url+'application/www/language/contact.xml', null, function (data, textStatus) {
        
        if (textStatus == "success") language = data;     

    }, 'xml').done(function(){ 
       
        /** form register validate */
        $("#form-contact").validate({

            errorElement: "span",

            rules:{
                "name" : {
                    required: true
                },
                "email" : {
                    required: true
                },
                "subject" : {
                    required: true
                },
                "mensage" : {
                    required: true
                }
            },

            messages:{
                "name" : {
                    required: $(language).find('data text[id="contact-name-error"] '+lang).text()
                },
                "email" : {
                    required: $(language).find('data text[id="contact-email-error"] '+lang).text()
                },
                "subject" : {
                    required: $(language).find('data text[id="contact-subject-error"] '+lang).text()
                },
                "mensage" : {
                    required: $(language).find('data text[id="contact-mensage-error"] '+lang).text()
                }
            },

            success: function() {
                errors = false;
            },

            invalidHandler: function(form, validator) {
                errors = true;
            },

            submitHandler: function(form) {
                $("#form-contact .submit").addClass('load').trigger("click");
            }

        });
          
    });
    
 
});