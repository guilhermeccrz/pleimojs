// ForgotView.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        ModalModel      = require('models/ui/ModalModel'),
        ModalView       = require('views/ui/ModalView');

    var base_url = window.base_url;
    var lang = window.lang;

    var ForgotView = ModalView.extend({
        initialize: function() {

            this.model = new ModalModel({
                className: 'modal.login.remember.outbox',
                content: ''
            });

            this.model.on('change:isOpen', this.toggle, this);
        },
        events: {
            "click a.btn-close": "close"
        },
        render: function() {
            var that = this;

            $.ajax({
                type: "POST",
                url: base_url + "forgot"
            }).done(function(data) {
                $('.modal').hide();
                $("body").append(data);
                that.addEvents();
            });

        },

        addEvents: function(){
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


                                var language;
                                $.get(base_url+'application/www/language/signin.xml', null, function (data, textStatus) {
                                    if (textStatus == "success") language = data;
                                }, 'xml').done(function(){
                                    $("#form-remember .submit").removeClass('wait').val($(language).find('data text[id="text-send"] '+lang).text());
                                });

                            });




                }

            });


        }


    });

    return ForgotView;
});