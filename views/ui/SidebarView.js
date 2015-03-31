// Filename: SidebarView.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone'),
        ContentFactory  = require('views/ContentFactory');

    var viewFactory = new ContentFactory();
    var base_url = window.base_url;

    var SidebarView = Backbone.View.extend({
        el: $("#sidebar"),

        initialize: function() {
            $(document).on('scroll resize',window, function() {
                $('.main-nav').css({'left': '', 'position': 'absolute'});
                var offset = $(document).scrollTop();
                var docH = $(document).innerHeight();
                var limit = (docH - $(".main-nav").height() - 433);

                if (offset > limit) {

                    var top = limit - offset;
                    $(".main-nav").css({
                        "position": "fixed",
                        "top": top + "px"
                    });

                }

                else{
                    $(".main-nav").css({
                        "position": "fixed",
                        "top": 45 + 48 + "px"
                    });
                }
            });



            this.session = arguments[0].session;
            this.listenTo(this.session, 'change:logged_in', this.sessionChange);
        },

        sessionChange: function() {
            var uri = location.pathname.substr(1);
            uri = (uri.indexOf('/') === 0) ? uri.substr(1) : uri.split('?')[0];
            uri = (uri.indexOf('?') == -1) ? uri : uri.split('?')[0];
            this.render(uri);
        },



        render: function(uri){


            uri = (uri) ? String(uri) : '';

            if (uri.length > 0) {



                //$('#sidebar').empty();
                var out = ['landing', 'about', 'plans', 'privacy', 'contact', 'terms', '404', 'faq', 'register', 'signup', 'complete', 'cart', 'geteasy', 'rockinrio', 'artist'];

                if ($('#content').hasClass("landing")) uri = "landing";
                if ($('#content').hasClass("register")) uri = "register";
                if ($('#content').hasClass("plans")) uri = "plans";
                if ($('#content').hasClass("geteasy")) uri = "geteasy";
                if ($('#content').hasClass('rockinrio')) uri = 'rockinrio';

                if (uri === "") {
                    if ($('#content').attr("class") === "") uri = "home";
                }
                if (uri == "search") {
                    uri = viewFactory.getURI();
                }

                uri = uri.split("#")[0];
                uri = uri.split("/");

                if (typeof uri == "string")
                    uri[0] = uri;



                if (out.indexOf(uri[0]) == -1) {
                    $.get(base_url + 'template/pleimo/sidebar')
                        .done(function(data) {

                            $("#sidebar").html(data);

                            // select active button
                            if (uri[0] == 'home') {
                                $('ul.main-nav-default li a[href*=home]').parent().addClass('select');
                            } else {
                                var url =  (uri[0] == 'profile') ? uri[1] : uri[0];
                                var li = $('ul li a[href*=' + url + ']');
                                if (li.length > 0) {
                                    li.parent().addClass('select');
                                }
                            }



                        });
                }
            }


            return this;
        }


    });

    return SidebarView;

});