(function ($, window) {

    /**
     * Pleimo namespace
     * @namespace pleimo
     */
    var pleimo = window.pleimo || {};

    $.get(base_url+'application/www/language/mail.xml', null, function (data, textStatus) {

        if (textStatus == "success") language = data;

    }, 'xml').done(function(){

        /**
         * Validate send form.
         * @author Renato Biancalana <r.silva@pleimo.com>
         */
        $("#form-mail").validate({

            rules : {
                "receiver" : {
                    required  : true,
                    email     : true
                }
            },

            messages : {
                "receiver" : {
                    required  : 'Este campo precisa ser preenchido',
                    email     : 'Este não é um e-mail válido'
                }
            },

            showErrors : function() {
                this.defaultShowErrors();
            },

            submitHandler: function() {
                $.ajax({
                    "url"  : base_url+'mail/share',
                    "type" : "POST",
                    "data" : ({
                                target   : $('#target').val(),
                                type     : $('#type').val(),
                                name     : $('#name').val(),
                                receiver : $('#receiver').val()
                             }),
                    beforeSend : function () {
                        $('.button.submit').val('').addClass('wait');
                    },
                    error : function () {
                        $('.button.submit').removeClass('wait').val('Enviar');
                    },
                    success : function(){
                        closeMask();
                    }
                });

            }

        });

    });

    /**
     * @namespace
     * @alias pleimo.mailshare
     */
    pleimo.mailshare = {



    }

    window.pleimo = pleimo;
})(jQuery, window);
