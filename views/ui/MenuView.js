// Filename: MenuView.js
define(function(require){

    "use strict";

    var $           = require('jquery'),
        Backbone    = require('backbone'),
        ContentFactory  = require('views/ContentFactory');

    var pleimo = window.pleimo || {};

    var base_url = window.base_url;

    pleimo.Menu = {
        timer: null,
        init: function() {
            /* menu click */
            $('.menuwrapper ul li a#menu').click(function(e) {
                e.preventDefault();

                pleimo.Menu.toggle();

                return false;
            });

            $('.menuwrapper ul li').mouseout(
                function() {
                    pleimo.Menu.out();
                }
            );

            $('.menuwrapper ul li ul.submenu li > a').click(function(e) {
                $('.menuwrapper > ul > li.open').removeClass('open');
            });

            /* close menu click */
            $(document).on("click", function(e) {
                $('.menuwrapper > ul > li.open').removeClass('open');
            });
        },
        out: function() {
            if (this.timer == null) {
                this.timer = setTimeout(pleimo.Menu.close, 1500);
            }
        },
        close: function() {
            clearTimeout(this.timer);
            this.timer = null;

            $('.menuwrapper > ul > li.open').removeClass('open');
        },
        open: function() {
            clearTimeout(this.timer);
            this.timer = null;

            $('.menuwrapper > ul > li').addClass('open');
        },
        toggle: function() {
            clearTimeout(this.timer);
            this.timer = null;

            $('.menuwrapper > ul > li').toggleClass('open');
        }
    };

    window.pleimo = pleimo;


    var viewFactory = new ContentFactory();
    var MenuView = Backbone.View.extend({
        el: $("section.header-account"),
        initialize: function() {
            var self = this;
            this.session = arguments[0].session;
            this.listenTo(this.session, 'change', this.render);
            self.getMenu();
            //console.log('initialize');
        },

        getMenu: function(){
            var self = this;
            $.get(base_url + 'template/pleimo/menu')
                .done(function(data) {
                    $("section.header-account").replaceWith(data);
                    $(window).trigger('resize');
                    self.initListeners();
                    self.activate();
                    self.checkCartQty();
                });
        },

        render: function() {
            var self = this;
            var selfAuth = this.session.get('logged_in');
            var elMenuState = $('.account ul li.name');

            if(selfAuth === false && elMenuState.length > 0 ){
              self.getMenu();
            }

            return this;
        },



        signIn: function(e){
            viewFactory.getView('modals/SignInView', function(view){
                view.render('','',undefined,'firstLogin');
            });
        },

        checkCartQty: function(){
            $("#cart-qty").on("cartEvent",function(e, pQty, nQty){

                var cartQty = $("#cart-qty");
                var qty = Number(cartQty.html());

                var nQtyC = '';

                if(pQty){qty = pQty;}
                if(nQty){nQtyC = nQty;}

                if(qty < 1){
                    cartQty.hide();
                    return;
                }

                if(qty == 1 && nQtyC ){
                    cartQty.html(nQtyC);
                }

                cartQty.css('display','block');
            });

            $("#cart-qty").trigger("cartEvent");
        },


        initListeners: function() {

            $('.signin-button').on('click', this.signIn);

            $("nav.cart .cart-sprite").hover(function() {
                    var $popover = $("nav.cart .cart-sprite .submenu");
                    $popover.css("display", "block");

                    $.ajax({
                        type: "POST",
                        url: base_url + "cart/popover"
                    }).done(function(data) {
                        $popover.removeClass("loading");
                        $popover.find("a.button").css("display", "block");
                        $popover.find(".products").html(data);
                    });
                },
                function() {
                    var $popover = $("nav.cart .cart-sprite .submenu");

                    $popover.css("display", "none");
                    $popover.find(".products").html('');
                    $popover.find("a.button").css("display", "none");
                    $popover.addClass("loading");
                });

            pleimo.Menu.init();
        },

        activate: function() {
            var uri = Backbone.history.location.pathname.substr(1);

            var $nav = $(".header-account .menuwrapper .submenu");

            $($nav).find("li").removeClass("active");

            switch (uri) {
                case "about":
                    $($nav).find("li.about").addClass("active");
                    break;

                case "plans":
                    $($nav).find("li.plans").addClass("active");
                    break;

                case "plans/artists":
                    $($nav).find("li.artists").addClass("active");
                    break;

                case "rockinrio":
                    $($nav).find("li.rir").addClass("active");
                    break;

            }
        }
    });

    return MenuView;
});