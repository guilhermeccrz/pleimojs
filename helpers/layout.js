// Filename: layout.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        // imagesLoaded    = require('imagesloaded'),
        Masonry         = require('masonry');
        require('viewportSize');

    var pleimo = window.pleimo;

    pleimo.Layout = {
        msnry : null,
        initMsnry: function(sel) {
            //console.log('initMsnry');
            sel = (sel) ? sel : '.box';
            var $container = document.querySelector('#grid');
            this.msnry = new Masonry($container, { itemSelector: sel, transitionDuration : '0.2s', isInitLayout: false });
            this.msnry.on( 'layoutComplete', function() {
                $(sel).show();
            });

            return this.msnry;
        },
        resize: function() {
            if ($('.full-list') && ($('.full-list').length > 0)) {
                var BOX = 260;
                var MENU = 150;
                var width = window.viewportSize.getWidth();
                var qty = Math.floor((width - MENU) / BOX);
                qty = (qty === 0) ? Math.floor((width - 64) / BOX) : qty;
                var w = qty * BOX;
                var wMENU = w + MENU;

                $('.full-list').width(w);
                $('.full-list').css('height','');

                if ($('.top10') && ($('.top10').length > 0)) { // FIXED TOP 10 ON TOP RIGHT
                    $('.top10').css({'left': w - BOX + 'px', 'position' :'absolute'});
                    if ((this.msnry !== null) && (typeof this.msnry.stamp === "function")) this.msnry.stamp(document.querySelector('.top10'));
                }

                if ($('.filter>ul').length > 0) $('.filter>ul').width(w - 20);

                $('#content .container_full').css({width: ''});
                $('#content .container_full, section.footer-nav .container_18, section.footer-copy .container_18, section.header-account .container_18').css({ width: wMENU + 'px'});

                if (w < 768) {
                    $('body').css('min-width', '320px');
                    $('section.header-account .container_18').css('width','');
                }

                // refresh masonry layout
                if ((this.msnry !== null) && (typeof this.msnry.layout === "function")) {
                    this.msnry.layout();
                   // console.log('masonry refresh');
                }
            } else {
                this.reset();
            }
        },
        reset: function() {
            // RESET
            $('section.footer-nav .container_18, section.footer-copy .container_18').css({width: ''});
            $('section.header-account .container_18').css({width: ''});

            $('.player .wrapper').css({width: ''});
            $('.player .progress-bar').css({width: ''});
            $('.player .music-player-rating').css({left: ''});
        }
    };

    $(document).trigger('layoutready');

    $(window).on('resize', function() {
        pleimo.Layout.resize();
    });

    window.pleimo = pleimo;

});