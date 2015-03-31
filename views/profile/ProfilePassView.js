// ProfilePassView.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone'),
        ContentFactory  = require('views/ContentFactory');
        require('validate');
        require('validatePleimo');

    var base_url = window.base_url;
    var lang = window.lang;
    var pleimo = window.pleimo || {};

    var viewFactory = new ContentFactory();

    var ProfilePassView = Backbone.View.extend({
        el: "#main",
        template: '/profile/pass',
        render: function() {
            var that = this;

            viewFactory.loadTemplate(this.template, {
                success: function(data, status) {
                    that.$el.html(data);
                    that.addEvents();
                },
                error: function(data, status) {
                    if (status == 404) {
                        that.$el.html(data);
                    }
                }
            }, { cache: false });
        },
        addEvents: function() {

            /*LANGUAGE XML*/
            var language = window.language || {};
            var errors;
            var that = this;
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
                        $("#form-passwd .submit").data('callback', {
                            success: function(data){
                                if (data) {
                                    that.$el.html(data);
                                    that.addEvents();

                                    // UPDATE SESSION
                                    pleimo.Session.checkAuth();
                                }
                            }
                        });
                        $("#form-passwd .submit").addClass('load').trigger("click");

                    }

                });

            });
        }

    });

    return ProfilePassView;
});
