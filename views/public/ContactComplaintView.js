define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone'),
        ContentFactory  = require('views/ContentFactory');
    require('validate');

    var viewFactory = new ContentFactory();
    var base_url = window.base_url;
    var lang = window.lang;

    var ContactComplaintView = Backbone.View.extend({
        el: '#main',
        template: '/contact/complaint',
        render: function() {

            var that = this;

            if ($('#content').attr('class') != "contact complaint") {
                viewFactory.loadTemplate(this.template, {
                    success: function(data, status) {
                        //console.log('ContactAdvertiseView');
                        that.$el.html(data);
                        that.addEvents();
                    },
                    error: function(data, status) {
                        if (status == 404) {
                            that.$el.html(data);
                        }
                    }
                }, {
                    cache: false
                });
            } else {
                $(document).trigger('View.loaded');
                this.addEvents();
            }
        },
        addEvents: function() {
            var that = this;

            var language = window.language || {};
            var errors;

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
                            required: true,
                            email:true
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
                            required: $(language).find('data text[id="contact-email-error"] '+lang).text(),
                            email: $(language).find('data text[id="contact-email-error"] '+lang).text()
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
                        $("#form-contact .submit").data("callback", {
                            success: function(data) {
                                that.$el.html(data);
                                that.addEvents();
                            }
                        });
                        $("#form-contact .submit").addClass('load').trigger("click");
                    }

                });

            });

        }

    });

    return ContactComplaintView;
});