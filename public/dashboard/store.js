$(function () {
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
                    //console.log('modal');
                    e.preventDefault();
                    pleimo.Store.showProducts($(this).data('artist'));
                    e.stopImmediatePropagation();
                });

                $('div.albums a.all').click(function(e){
                    e.preventDefault();
                    pleimo.Store.showAlbums($(this).data('artist'));
                    e.stopImmediatePropagation();
                });

                $('div.albums a.all-musics').click(function(e){
                    e.preventDefault();
                    pleimo.Store.showMusics($(this).data('artist'));
                    e.stopImmediatePropagation();
                });

                $(document).on('click', '.btn-delete-product', function(e) {
                    e.preventDefault();
                    pleimo.Store.removeProduct($(this));
                    e.stopImmediatePropagation();
                });

                $(document).on('click', '.btn-delete-music', function(e) {
                    e.preventDefault();
                    pleimo.Store.removeMusic($(this));
                    e.stopImmediatePropagation();
                })

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

            /**
             * This method will show the modal of products
             *
             * @method showProducts
             * @author Renato Biancalana da Silva <r.silva@pleimo.com>
             * @param artist
             * @alias pleimo.Store.showProducts
             */
            showProducts : function(artist) {
                $.ajax({
                    type : "POST",
                    data : ({artist : artist, page : 1}),
                    url  : window.base_url+'dashboard/mystore/products',
                    beforeSend : function() {
                        openMask();
                        $('body').append('<div class="modal dashboard-store products outbox loading"></div>');
                    },
                    success : function(data) {
                        pleimo.Store.url = 'dashboard/mystore/products/content';
                        pleimo.Store.modal = $('div.modal.products');
                        pleimo.Store.artist = artist;

                        $('div.modal.products').removeClass('loading');
                        $('div.modal.products').append(data);

                        pleimo.Store.pagination();
                    }
                })
            },

            /**
             * This method will show the modal of albums.
             *
             * @method showAlbums
             * @author Renato Biancalana da Silva <r.silva@pleimo.com>
             * @param artist
             * @alias pleimo.Store.showAlbums
             */
            showAlbums : function (artist) {
                $.ajax({
                    type : "POST",
                    data : ({artist : artist, page : 1}),
                    url  : window.base_url+'dashboard/mystore/albums',
                    beforeSend : function() {
                        openMask();
                        $('body').append('<div class="modal dashboard-store albums outbox loading"></div>');
                    },
                    success : function(data) {
                        pleimo.Store.url = 'dashboard/mystore/albums/content';
                        pleimo.Store.modal = $('div.modal.albums');
                        pleimo.Store.artist = artist;

                        $(pleimo.Store.modal).removeClass('loading');
                        $(pleimo.Store.modal).append(data);

                        pleimo.Store.pagination();
                    }
                })
            },

            /**
             * This method will show the modal of musics
             *
             * @method showMusics
             * @author Renato Biancalana da Silva <r.silva@pleimo.com>
             * @param artist
             * @alias pleimo.Store.showMusics
             */
            showMusics : function (artist) {
                $.ajax({
                    type : "POST",
                    data : ({artist : artist, page : 1}),
                    url  : window.base_url+'dashboard/mystore/musics',
                    beforeSend : function() {
                        openMask();
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
                })
            },

            /**
             * This method will remove a product from carousel or modal
             * and make all stuffs to reorganize the carousel and change infos
             * and icons on modal
             *
             * @method removeProduct
             * @author Renato Biancalana da Silva <r.silva@pleimo.com
             * @param element
             * @alias pleimo.Store.removeProduct
             */
            removeProduct : function (element) {
                var product = $(element).data('product');
                $.ajax({
                    type : "POST",
                    url  : window.base_url+'register/product/remove',
                    data : ({product_id : product}),
                    beforeSend : function() {
                        if($(element).hasClass('has-tip')) {
                            $(element).parent().parent().parent()
                                .remove();

                            var elements = $('ul#products div.item');
                            $('ul#products').empty();
                            elements.each(function(index, value){
                                if (index % 5 == 0) $('ul#products').append('<li></li>');
                                $('ul#products li:last').append(value);
                            });

                            var qty = $('.store.totals .box.products').find('h2').text();
                            var numQty = Number(qty)-1;

                            $('.store.totals .box.products').find('h2').text(numQty);
                        }else{
                            $(element).parent().parent().find('.status')
                                .addClass('inactive').text($(language).find('data text[id="mystore-products-inactive"] '+lang).text());

                            $('ul#products').find('a[data-product="'+product+'"]').
                                parent().parent().parent().
                                remove();

                            var elements = $('ul#products div.item');
                            $('ul#products').empty();
                            elements.each(function(index, value){
                                if (index % 5 == 0) $('ul#products').append('<li></li>');
                                $('ul#products li:last').append(value);
                            })

                            var qty = $('.store.totals .box.products').find('h2').text();
                            var numQty = Number(qty)-1;

                            $('.store.totals .box.products').find('h2').text(numQty);
                        }
                    },
                    error : function () {
                        if( ! $(element).hasClass('has-tip')) {
                            $(element).parent().parent().find('.status')
                            .removeClass('inactive').text($(language).find('data text[id="mystore-products-active"] '+lang).text());
                        }

                        var qty = $('.store.totals .box.products').find('h2').text();
                        var numQty = Number(qty)+1;

                        $('.store.totals .box.products').find('h2').text(numQty);
                    },
                    success : function () {
                        if( ! $(element).hasClass('has-tip')) {
                            $(element).parent().parent().find('.btn-edit').parent().html('');
                            $(element).parent().html('');
                        }


                    }
                })
            },

            /**
             * This method will remove a music from carousel or modal
             * and make all stuffs to reorganize the carousel and change infos
             * and icons on modal
             *
             * @method removeMusic
             * @author Renato Biancalana da Silva <r.silva@pleimo.com
             * @param element
             * @alias pleimo.Store.removeMusic
             */
            removeMusic : function (element) {
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
                })
            },

            /**
             * This method will handle all stuffs about pagination on
             * modals of products, albums and any other.
             *
             * @method pagination
             * @author Renato Biancalana da Silva <r.silva@pleimo.com>
             * @alias pleimo.Store.pagination
             */
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
        }

        window.pleimo = pleimo;

        $(document).ready(function() {
            pleimo.Store.init();
        });

        $(document).on('ajaxloaded', function(evt, uri, status) {
            var arr = uri.split('/');

            if ((arr.length <= 3) && (arr[0] == 'dashboard') && (arr[1] == 'mystore')) {
                pleimo.Store.init();
            }
        });

    });

});
