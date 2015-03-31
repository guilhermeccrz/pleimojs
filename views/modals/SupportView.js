// SupportView.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        ContentFactory  = require('views/ContentFactory'),
        ModalModel      = require('models/ui/ModalModel'),
        ModalView       = require('views/ui/ModalView');

        require('suggest');

    var lang = window.lang;
    var base_url = window.base_url;

    var pleimo = window.pleimo || {};
    var viewFactory = new ContentFactory();

    var SupportView = ModalView.extend({
        initialize: function() {

            this.model = new ModalModel({
                className: '.modal.welcome-modal',
                content: ''
            });

            this.model.on('change:isOpen', this.toggle, this);

        },
        events: {

            "click #preferred-support .save": function(){
               this.saveSuggest();
            },

            "click #preferred-support .close": function(){
               this.closeSuggest();
            },



            "click #mask": "close"

        },

        saveSuggest: function(){
            pleimo.firstLogin == 1;
            pleimo.Options.support_artist = 1;
            var that = this;

            $('#preferred-genders').on('submit', function() {return false;});

            $.ajax({
                url  : window.base_url+'support/save',
                type : "POST",
                data : ({artist: $('#selectedArtist').val(), name: $('#artist-search').val()}),
                beforeSend : function () {
                    $('button.save').html('<span class="wait"></span>');
                },
                error : function () {
                    $('button.save').html($(pleimo.Language.Preferences).find('data text[id="supporter-confirm"] '+lang).text());
                },
                success : function () {
                    if (location.pathname == "/profile"){
                        //setting saving form
                        $('#form-settings').sayt({'autosave': false, 'autorecover': false, 'days': 1});
                        $('#form-settings').sayt({'savenow': true});
                        window.location.reload(true);
                        $('.content-loading').show();
                    }

                    if (typeof pleimo.Options.chose_genders === 'undefined'){
                         viewFactory.createView('genders'); //pleimo.Template.Genders();
                        that.closeSuggest();

                        return;
                    }

                    if (pleimo.Options.chose_genders === 1){
                        that.closeSuggest();
                    }
                }
            });

        },
        closeSuggest: function(){
            var that = this;
            pleimo.Options.support_artist = 0;
            $('#preferred-genders').on('submit', function() {return false; });

            if (typeof pleimo.Options.chose_genders === 'undefined') {
                viewFactory.createView('genders'); //pleimo.Template.Genders();

                return;
            }

            that.close();
        },
        render: function() {
            var template = '/support';

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
			var firstTimeinHome    = (window.support!=1) && (document.URL == base_url+"home" || document.URL == base_url);
			var clickSupportButton = document.URL == base_url+"profile";

			if (!firstTimeinHome && !clickSupportButton)
			return;

			window.support = 1;

            var pleimo = window.pleimo || {};
            $.get(base_url+'application/www/language/supporters.xml' , null, function (data, textStatus) {
                if (textStatus == "success") {
                    pleimo.Language = {Preferences : data};
                }
            }, 'xml');

			pleimo.Suggest.init($('#artist-search'), $('#artist-suggest'));
            window.pleimo = pleimo;
        }
    });

    return SupportView;

});