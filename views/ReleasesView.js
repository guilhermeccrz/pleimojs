// Filename: ReleasesView.js
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
    var $content;
    var base_url = window.base_url;
    var $tmpl      = $.get(base_url+'application/www/views/artists/box.tpl');

    var load = {
        pageNum : 1,
        limit: 24,
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

            this.offset = this.pageNum * this.limit;
            this.pageNum++;

            $content.after('<div class="loading"></div>');

            var that = this;
            this.req = $.ajax({
                type: "POST",
                url: base_url+"artists/page/"+this.limit+"/"+this.offset,
                data: { order : $("#order").val(), genre : $("#genre").val(), name : $("#name").val() }
            }).done(function( data ) {

                    data = $.parseJSON(data);

                    $content.parent().find(".loading").remove();

                    if ( ! data.length) {
                        that.total = true;
                        return false;
                    }

                    var elems = $.tmpl($tmpl.responseText, data);

                    that.append(elems);

                    if (that.pageNum >= 3)
                        $content.after('<div class="load-more"><span></span></div>');

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
                    if ((elems[i][0]!== null) && ($(elems[i])[0].tagName === 'LI')) {
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

    var ReleasesView = Backbone.View.extend({
        el: $("#main"),
        template: '/artists',
        render: function(filter){
            filter = (typeof filter !== "undefined") ? filter : '';
            var that = this;

            viewFactory.loadTemplate(this.template, {
                success: function(data) {
                    that.$el.html(data);
                    that.addEvents();
                },
                error: function(data, status) {
                    if (status === 404) {
                        that.$el.html(data);
                    }
                }
            }, {
                method: 'POST',
                data: filter,
                cache: false
            });
        },
        addEvents: function() {
            var that = this;
            var language = window.language;

            $('#form-filter input.submit').data('callback', {
                success: function(data) {
                    that.$el.html(data);
                    that.addEvents();
                },
                error: function(data, status) {
                    if (status === 404) {
                        that.$el.html(data);
                    }
                }
            });

            $.get(base_url+'application/www/language/artists.xml', null, function (data, textStatus) {

                if (textStatus === "success") language = data;

            }, 'xml').done(function(){

                load.reset();
                $content = $("#grid");

                $content.find('.box').css({opacity:0});

                $content.imagesLoaded(function(){
                    $content.find('.box').animate({ opacity: 1});
                    load.append(null);
                });

                $(document).off('scroll.artists').on('scroll.artists', function()
                {
                    if($(window).scrollTop() + $(window).height() >= ($(document).height() * 70/100) && load.req === null)
                    {
                        if (load.pageNum >= 3 || load.total === true)
                            return false;

                        load.page(load.limit, load.offset);
                    }
                    if (window.location.pathname !== '/artists') {
                        that.abort();
                        $(document).off('.artists');
                    }
                });

                $(document).on('click.artists', '.load-more', function() {
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

    return ReleasesView;
});