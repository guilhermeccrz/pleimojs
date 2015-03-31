// Filename: RadiosView.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone'),
        ContentFactory  = require('views/ContentFactory'),
        imagesLoaded    = require('imagesloaded');
        require('layout');

        require('jquery_tmpl');

    var viewFactory = new ContentFactory();

    var pleimo = window.pleimo;
    var base_url = window.base_url;
    var $content;
    var load = {
        pageNum : 1,
        limit: 29,
        offset: 0,
        req: null,
        total: false,
        timeout: null,
        timereq: null,

        "page" : function(limit, offset) {

            var oldtimereq = this.timereq || new Date();
            this.timereq = new Date();

            if (this.req !== null) {
                if ((this.timereq - oldtimereq) > 5000) {
                    this.req.abort();
                    this.req = null;
                    load.page(load.limit, load.offset);
                } else {
                    setTimeout(function() {
                        load.page(load.limit, load.offset);
                    }, 500);
                }

                return;
            }

            if ($content.find(".artist-box").length < 12) return false;

            this.offset = this.pageNum * this.limit;
            this.pageNum++;

            $content.after('<div class="loading"></div>');

            var that = this;
            this.req = $.ajax({
                type: "POST",
                url: base_url+"radio/page/"+this.limit+"/"+this.offset,
                data: { }
            }).done(function( data ) {

                    data = $.parseJSON(data);

                    $content.parent().find(".loading").remove();

                    if ( ! data.length) {
                        that.total = true;
                        return false;
                    }

                    that.req = null;
                    that.timereq = null;

                });

        },

        "append" : function(elems) {
            var $msnry = pleimo.Layout.initMsnry();
            $msnry.layout();

            if (elems !== null) {
                var arr = [];
                for (var i = 0; i < elems.length; i++) {
                    if ((elems[i][0]!== null) && ($(elems[i])[0].tagName == 'LI')) {
                        var el = elems[i];
                        arr.push(el);
                        $(el).css({ display: 'block', opacity: 1});
                    }
                }

                $content.append(arr);
                $msnry.appended(arr);

                var imgLoad = imagesLoaded('#grid');
                imgLoad.on('done', function(){
                    $content.find('.box').fadeIn();

                    $(window).trigger('resize');
                });
            }

            $(window).trigger('resize');
        },

        reset: function() {
            this.pageNum = 1;
            this.limit = 24;
            this.offset = 0;
            this.req = null;
            this.total = false;
        }
    };

    var RadiosView = Backbone.View.extend({
        el: $("#main"),
        template: '/radio',
        render: function(){
            var that = this;

            if (!$('#content').hasClass('radio')) {
                viewFactory.loadTemplate(this.template, {
                    success: function(data) {

                        that.$el.html(data);
                        that.addEvents();
                    },
                    error: function(data, status) {
                        if (status == 404) {
                            that.$el.html(data);
                        }
                    }
                });
            } else {
                $(document).trigger('View.loaded');
                this.addEvents();
            }
        },
        addEvents: function() {
            var that = this;
            var language = window.language;

            $.get(base_url+'application/www/language/artists.xml', null, function (data, textStatus) {

                if (textStatus == "success") language = data;

            }, 'xml').done(function(){

                $content = $("#grid");
                load.reset();

                $content.find('.box').css({opacity:0});

                $content.imagesLoaded(function(){
                    $content.find('.box').animate({ opacity: 1});
                    load.append(null);
                });

                $(document).off('scroll.radios').on('scroll.radios', function()
                {
                    if($(window).scrollTop() + $(window).height() >= ($(document).height() * 70/100) && load.req === null)
                    {
                        if (load.pageNum >= 3 || load.total === true)
                            return false;

                        load.page(load.limit, load.offset);
                    }
                    if (window.location.pathname != '/radios') {
                        that.abort();
                        $(document).off('.radios');
                    }
                });

                $(document).on('click.radios', '.load-more', function() {
                    $(this).remove();
                    load.page(load.limit, load.offset);
                });

            });
        },
        abort : function() {
            if (load.req !== null) {
                load.req.abort();
            }
        }
    });

    return RadiosView;
});