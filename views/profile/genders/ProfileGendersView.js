define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone');
        //require('template');

    var base_url = window.base_url;
    var scroll = window.scroll;
    var errors;

    var closeMask = function() {
        $("#mask").hide();
        $(document).scrollTop(scroll);

        scroll = null;
        errors = false;

        if ($('.zoomContainer').length > 0) {
            $('.zoomContainer').remove(); // remove zoom container from DOM
        }

        $(".blackbox, .outbox").remove();
    };

    var ProfileGendersView = Backbone.View.extend({
        el: $("#product-image"),


        render: function() {
            var pleimo = window.pleimo || {};

            $.get(base_url+'application/www/language/preferences.xml', null, function (data, textStatus) {

                if (textStatus == "success") pleimo.Language = data;

            }, 'xml').done(function(){



                $('button.save').click(function(e){

                    e.stopPropagation();
                    e.preventDefault();

                    pleimo.Genders.Save();
                    closeMask();

                });

                $('.button.close.genders').click(function(e){
                    e.stopPropagation();
                    e.preventDefault();

                    pleimo.Genders.Close();
                    closeMask();
                });

                $('.welcome-modal input[type=checkbox]').each(function(){

                    var self = $(this),
                        label = self.next(),
                        label_text = label.text();

                    label.remove();

                    self.iCheck({
                        checkboxClass: 'icheckbox_prefs',
                        radioClass: 'iradio_prefs',
                        insert: label_text +' <div class="icheck_prefs-icon"></div>'
                    });

                });

            });

            var genders = {

                "Save" : function() {

                    $.ajax({
                        url  : base_url+'genders/save',
                        type : "POST",
                        data : $('#preferred-genders').serialize(),
                        beforeSend : function()
                        {
                            $('button.save').empty();
                            $('button.save').html('<span class="wait"></span>');
                        },
                        success : function()
                        {
                            //History.pushState(null, null, base_url+'home');
                            pleimo.Template.Controller('home');
                            pleimo.Options.chose_genders = 1;
                        }
                    });

                },

                "Close" : function() {
                    closeMask();
                    pleimo.Options.chose_genders = 0;

                    $.ajax({
                        url  : window.base_url+'genders/close',
                        type : "POST",
                        success : function () {

                        }
                    });
                }
            };

            pleimo.Genders = genders;

            window.pleimo = pleimo;
        }

    });

    return ProfileGendersView;
});
