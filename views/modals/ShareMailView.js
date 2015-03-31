// ShareMail.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        ModalModel      = require('models/ui/ModalModel'),
        ModalView       = require('views/ui/ModalView');

    require('validate');
    require('validatePleimo');

    var base_url = window.base_url;
    var lang = window.lang;

    var ShareMailView = ModalView.extend({
        initialize: function() {
            this.model = new ModalModel({
                className: '.modal.mail.blackbox',
                content: ''
            });

            this.model.on('change:isOpen', this.toggle, this);
        },
        events: {
            "click #mask": "close"
        },
        selfRemove: function(){
            $('.terms').remove();
        },

        addEvents: function(){
            var language;
            $.get(base_url+'application/www/language/mail.xml', null, function (data, textStatus) {

                if (textStatus == "success") language = data;

            }, 'xml').done(function(){
                var send = $(language).find('data text[id="share-mail-send"] '+lang).text();

                $("#form-mail").validate({

                    rules : {
                        "receiver" : {
                            required  : true,
                            email     : true
                        }
                    },

                    messages : {
                        "receiver" : {
                            required  : $(language).find('data text[id="share-mail-error-required"] '+lang).text(),
                            email     : $(language).find('data text[id="share-mail-error-email"] '+lang).text()
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
                                $('.button.submit').removeClass('wait').val(send);
                            },
                            success : function(){
                                window.closeMask();

                            }

                        });

                    }

                });

            });

        },
        render: function(type,target) {
            var that = this;

            $.ajax({
                "url"  : base_url+"xhr/mailshare",
                "type" : "POST",
                "data" : ({'type' : type, 'target' : target}),
                "success" : function(data){
                    window.openMask();
                    $('body').append(data);
                    that.addEvents();
                }
            });
        }
    });

    return ShareMailView;
});