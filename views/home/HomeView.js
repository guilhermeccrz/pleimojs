// Filename: HomeView.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone'),
        ContentFactory  = require('views/ContentFactory'),
        imagesLoaded    = require('imagesloaded'),
        ShareView       = require('views/ui/ShareView');
        require('viewportSize');
        require('layout');
        require('jquery_tmpl');

    var pleimo = window.pleimo || {};
    var base_url = window.base_url;

    var viewFactory = new ContentFactory();

    var $content;
    var $tmpl = $.get(base_url+'application/www/views/artists/box.tpl');
    var load = {
        pageNum : 1,
        limit: 24,
        offset: 0,
        req: null,
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
                url: base_url+"home/page/"+this.limit+"/"+this.offset
            }).done(function( data ) {
                data = $.parseJSON(data);

                $content.parent().find(".loading").remove();
                var elems = $.tmpl($tmpl.responseText, data);

                that.append(elems);

               

                if (that.pageNum >= 3)
                    $content.after('<div class="load-more"><span></span></div>');

                that.req = null;
                that.timereq = null;
            });

        },

        "append" : function(elems) {
            var $msnry = pleimo.Layout.initMsnry('.box');
            $msnry.stamp(document.querySelector('.top10'));
            $msnry.layout();

            if (elems !== null) {
                var arr = [];
                for (var i = 0; i < elems.length; i++) {
                    if ((elems[i][0]!== null) && ($(elems[i])[0].tagName == 'LI')) {
                        var el = elems[i];
                        arr.push(el);
                        $(el).hide();
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

    var HomeView = Backbone.View.extend({
        el: "#main",
        template: '/home',
        initialize: function(){
          this.shareView = new ShareView();

        },
        render: function(){
            var that = this;

            //if (!$('#content').hasClass('home')) {
                viewFactory.loadTemplate(this.template, {
                    success: function(data, status) {
                        that.$el.html(data);
                        that.addEvents();
                        that.shareView.render();
                    },
                    error: function(data, status) {
                        if (status == 404) {
                            that.$el.html(data);
                        }
                    }
                }, { cache: false });
            //} else {
                //$(document).trigger('View.loaded');
                //this.addEvents();
            //}
        },

        addEvents: function() {
            var that = this;
            var language;

            if (pleimo.Session.get('SUBSCRIPTION_STATUS') === '3' && pleimo.Session.get('FIRST_LOGIN') === true){
                viewFactory.getView('modals/CheckoutView', function(view){
                    view.render('offSubscription');

                });
            }


            $.get(base_url+'application/www/language/artists.xml', null, function (data, textStatus) {

                if (textStatus == "success") language = data;

            }, 'xml').done(function(){
                $content = $("#grid");
                load.reset();

                var imgLoad = imagesLoaded('#grid');
                imgLoad.on('done', function(){
                    $content.find('.box').css({'display':'block'});
                    $content.find('.box').animate({ opacity: 1});
                    load.append(null);
                });

                if (pleimo.firstLogin !== undefined) {
                    if (pleimo.firstLogin != 1) {
                        if (typeof pleimo.Options.support_artist === 'undefined') {


                            if (pleimo.Session.get('SUBSCRIPTION_STATUS') === '1' && pleimo.Session.get('FIRST_LOGIN') === true){

                                viewFactory.createView('support');


                            }

                        } else {
                           if (typeof pleimo.Options.chose_genders === 'undefined')
                              viewFactory.createView('genders');
                        }
                    }
                }

                $(document).off('scroll.home').on('scroll.home', function() {
                    if(($(window).scrollTop() + window.viewportSize.getHeight()) >= ($(document).height() * 70/100) && (load.req === null) && (window.location.pathname == "/" || window.location.pathname == "/home"))
                    {
                        if (load.pageNum >= 3)
                            return false;

                        load.page(load.limit, load.offset);
                    }
                    if ((window.location.pathname != "/") && (window.location.pathname != "/home")) {
                        that.abort();
                        $(document).off('.home');
                    }
                });

                $(document).on('click.home', '.load-more span', function() {
                    $('.load-more').remove();
                    load.page(load.limit, load.offset);

                });
            });

            $('.box.masonry').parent().bind( 'transitionend', function() {
                $('.box.masonry').removeClass('masonry');
            });
        },
        abort : function() {
            if (load.req !== null) {
                load.req.abort();
            }
        }
    });

    return HomeView;
});