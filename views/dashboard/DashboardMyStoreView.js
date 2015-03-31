define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone'),
        ContentFactory  = require('views/ContentFactory'),
        DashboardMenuView = require('views/dashboard/DashboardMenuView');

        require('carouFredSel');

    var viewFactory = new ContentFactory();

    var DashboardMyStoreView = Backbone.View.extend({
        el: '#main',

        allProducts: function(artist) {
            viewFactory.getView('modals/AllProductsView', function(view) {
                view.render(artist);
            });
        },

        allMusics: function(artist) {
            viewFactory.getView('modals/AllMusicsView', function(view) {
                view.render(artist);
            });
        },

        render: function(){
            var that = this;

            this.template = location.pathname.substr(1);

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
            var that = this;
            this.dashboardMenuView = new DashboardMenuView();
            this.dashboardMenuView.render();

            var language;

            /**
             * Pleimo namespace
             * @namespace pleimo
             */
            var pleimo = window.pleimo || {};

            $.get(window.base_url+'application/www/language/dashboard.xml', null, function (data, textStatus) {

                if (textStatus == "success") language = data;

            }, 'xml').done(function(){

                /**
                 * @namespace
                 * @alias pleimo.Store
                 */
                pleimo.Store = {
                    url: '',
                    modal: null,
                    artist: 0,

                    init: function() {
                        $('div.products a.all').click(function(e){
                            e.preventDefault();

                            var artist = location.pathname.match(/\d+/)[0];
                            that.allProducts(artist);
                           // pleimo.Store.showProducts($(this).data('artist'));
                            e.stopImmediatePropagation();
                        });

                        $('div.albums a.all').click(function(e){
                            e.preventDefault();

                            var artist = location.pathname.match(/\d+/)[0];
                            pleimo.Store.showAlbums(artist);
                            e.stopImmediatePropagation();
                        });

                        $('div.albums a.all-musics').click(function(e){
                            e.preventDefault();

                            var artist = location.pathname.match(/\d+/)[0];
                            that.allMusics(artist);
                           // pleimo.Store.showMusics($(this).data('artist'));
                            e.stopImmediatePropagation();
                        });

                        /*$(document).on('click', '.btn-delete-product', function(e) {
                            e.preventDefault();
                            that.removeProducts($(this));
                            //pleimo.Store.removeProduct($(this));
                            e.stopImmediatePropagation();
                        });*/

                        /*$(document).on('click', '.btn-delete-music', function(e) {
                            e.preventDefault();
                            pleimo.Store.removeMusic($(this));
                            e.stopImmediatePropagation();
                        })*/

                        $('*[data-tooltip]').hover(function(e) {
                            e.preventDefault();

                            var tooltip = $(this).find('div.tooltip');
                            if (! (tooltip && (tooltip.length > 0)) ) {
                                var title = $(this).attr('title');
                                $(this).attr('title', '');
                                $(this).append('<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner">' + title + '</div></div>');
                                tooltip = $(this).find('div.tooltip');
                                if ($(this).hasClass('tip-bottom')) tooltip.addClass('bottom');
                                if ($(this).hasClass('tip-top')) tooltip.addClass('top');
                                if ($(this).hasClass('tip-left')) tooltip.addClass('left');
                                if ($(this).hasClass('tip-right')) tooltip.addClass('right');
                            }
                            $(tooltip).animate({opacity: 1}, 300);
                        }, function(e) {
                            var tooltip = $(this).find('div.tooltip');
                            var title = tooltip.find('div.tooltip-inner').text();
                            $(this).attr('title', title);
                            tooltip.remove();
                        });

                        $("#products").carouFredSel({
                            direction: 'up',
                            height: '200px',
                            scroll: 1,
                            min: 5,
                            prev: '#products-prev',
                            next: '#products-next',
                            auto: false,
                            items: 1
                        });

                        $("#albums").carouFredSel({
                            direction: 'up',
                            height: '200px',
                            scroll: 1,
                            prev: '#albums-prev',
                            next: '#albums-next',
                            min: 5,
                            auto: false,
                            items: 1
                        });

                        /*
                         $("#tickets").carouFredSel({
                         direction: 'up',
                         height: '200px',
                         scroll: 1,
                         prev: '#tickets-prev',
                         next: '#tickets-next',
                         auto: false,
                         items: 1
                         });*/
                    },


                    pagination: function() {
                        $(".modal.dashboard-store .pagination a").on("click", function(e) {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            var current = $('.modal.dashboard-store .pagination li.current a').text();
                            var page = Number(current);

                            if ($(this).parent().hasClass('page')) {
                                page = Number($(this).data('page'));

                                $('ul.pagination li.arrow').removeClass('unavailable');
                                $('ul.pagination li.current').removeClass('current').addClass('page');
                                $(this).parent().addClass('current');

                                if ($(this).parent().next().is('ul.pagination li:last')){
                                    $(this).parent().next().addClass('unavailable');
                                }

                                if ($(this).parent().prev().is('ul.pagination li:first')){
                                    $(this).parent().prev().addClass('unavailable');
                                }
                            }

                            if ($(this).parent().hasClass('arrow')) {
                                if (!$(this).parent().hasClass('unavailable')) {
                                    if ($(this).parent().hasClass('page-prev')) {
                                        page--;
                                        $('li.arrow').removeClass('unavailable');
                                        $('li.current').removeClass('current').addClass('page')
                                            .prev().addClass('current');

                                        if ($('li.current').prev().is('ul.pagination li:first')){
                                            $(this).parent().addClass('unavailable');
                                        }
                                    } else {
                                        page++;
                                        $('li.arrow').removeClass('unavailable');
                                        $('li.current').removeClass('current').addClass('page')
                                            .next().addClass('current');

                                        if ($('li.current').next().is('ul.pagination li:last')){
                                            $(this).parent().addClass('unavailable');
                                        }
                                    }
                                }
                            }

                            if (page != current) {
                                $.ajax({
                                    type : "POST",
                                    data : ({artist : pleimo.Store.artist, page : page}),
                                    url  : window.base_url+pleimo.Store.url,
                                    beforeSend : function() {
                                        $(pleimo.Store.modal).find('tbody').empty().append('<td class="loading" colspan="7"></td>');
                                    },
                                    success : function(data) {
                                        $(pleimo.Store.modal).find('tbody').empty();
                                        $(pleimo.Store.modal).find('tbody').html(data);

                                        pleimo.Store.pagination();
                                    }
                                });
                            }
                        });
                    }
                };

                pleimo.Store.init();

                window.pleimo = pleimo;
            });

        }


    });

    return DashboardMyStoreView;
});