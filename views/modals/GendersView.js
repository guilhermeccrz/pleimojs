// GendersView.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        ModalModel      = require('models/ui/ModalModel'),
        ModalView       = require('views/ui/ModalView');

    require('icheck');

    var base_url = window.base_url;

    var GendersView = ModalView.extend({
        initialize: function() {

            this.model = new ModalModel({
                className: '.modal.welcome-modal.plan-web.plan-power.blackbox',
                content: ''
            });

            this.model.on('change:isOpen', this.toggle, this);
        },

        events: {
            "click #mask": "close",
            "click #preferred-genders button.save": "saveGenders",
            "click #preferred-genders button.close.genders": "closeGenders"
        },

        saveGenders: function(){
            var that = this;
            var pleimo = window.pleimo || {};
            $('#preferred-genders').on('submit', function() {return false;});
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
                    pleimo.Options.chose_genders = 1;
                    that.close();
                }
            });
        },

        closeGenders: function(){
            var that = this;
            var pleimo = window.pleimo || {};
            pleimo.Options.chose_genders = 0;

            $('#preferred-genders').on('submit', function() {return false;});
           /* $.ajax({
                url  : window.base_url+'genders/close',
                type : "POST",
                success : function () { that.close(); }
            });*/

            that.close();
        },

        render: function() {
            var template = '/genders';

            var that = this;
            $.ajax({
                type : "GET",
                url  : template
            }).done(function(data){
                that.setContent(data);
                that.addEvents();
            });
        },
        addEvents: function() {
            var pleimo = window.pleimo || {};
            $('#preferred-genders').on('submit', function() {return false;});

            $.get(base_url+'application/www/language/preferences.xml', null, function (data, textStatus) {

                if (textStatus == "success") pleimo.Language = data;

            }, 'xml').done(function(){

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

            window.pleimo = pleimo;
        }
    });

    return GendersView;
});