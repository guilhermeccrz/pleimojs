// AllMusicsView.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        ModalModel      = require('models/ui/ModalModel'),
        ModalView       = require('views/ui/ModalView');

    var pleimo = window.pleimo || {};
    var lang = window.lang;

    var AllMusicsView = ModalView.extend({
        initialize: function() {

            this.model = new ModalModel({
                className: 'modal dashboard-store products outbox'
            });

            this.model.on('change:isOpen', this.toggle, this);
        },

        events: {
            "click #mask": "close"
        },

        render: function(artist) {

            var that = this;
            $.ajax({
                type : "POST",
                data : ({artist : artist, page : 1}),
                url  : window.base_url+'dashboard/mystore/musics',
                beforeSend : function() {
                    that.open();
                    $('body').append('<div class="modal dashboard-store musics outbox loading"></div>');
                },
                success : function(data) {
                    pleimo.Store.url = 'dashboard/mystore/musics/content';
                    pleimo.Store.modal = $('div.modal.musics');
                    pleimo.Store.artist = artist;

                    $(pleimo.Store.modal).removeClass('loading');
                    $(pleimo.Store.modal).append(data);

                    pleimo.Store.pagination();
                }
            });

            $(document).on('click', '.btn-delete-music', function(e) {
                e.preventDefault();
                that.remove($(this));
                e.stopImmediatePropagation();
            });

        },

        remove: function(element){
            var language;

            $.get(window.base_url+'application/www/language/dashboard.xml', null, function (data, textStatus) {

                if (textStatus == "success") language = data;

            }, 'xml').done(function(){

            var music = $(element).data('music');
            $.ajax({
                type : "POST",
                url  : window.base_url+'artist/edit/music/delete',
                data : ({id : music}),
                beforeSend : function() {
                    $(element).parent().parent().find('.status')
                        .addClass('inactive').text($(language).find('data text[id="mystore-products-inactive"] '+lang).text());

                    var qty = $('.store.totals .box.musics').find('h2').text();
                    var numQty = Number(qty)-1;

                    $('.store.totals .box.musics').find('h2').text(numQty);
                },
                error : function () {
                    $(element).parent().parent().find('.status')
                        .removeClass('inactive').text($(language).find('data text[id="mystore-products-active"] '+lang).text());

                    var qty = $('.store.totals .box.musics').find('h2').text();
                    var numQty = Number(qty)+1;

                    $('.store.totals .box.musics').find('h2').text(numQty);
                },
                success : function (data) {
                    data = $.parseJSON(data);
                    if (data.status == "success") {
                        $(element).parent().parent().find('.btn-edit').parent().html('');
                        $(element).parent().html('');
                    } else{
                        $(element).parent().parent().find('.status')
                            .removeClass('inactive').text($(language).find('data text[id="mystore-products-active"] '+lang).text());
                    }

                }
            });

            });

        }
    });

    return AllMusicsView;
});