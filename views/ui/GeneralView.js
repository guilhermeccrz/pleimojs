// GeneralView.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone'),
        ContentFactory  = require('views/ContentFactory'),
        FavoritesView   = require('views/ui/FavoritesView'),
        GA              = require('gga');
        require('viewportSize');

    var pleimo = window.pleimo;
    var base_url = window.base_url;

    var viewFactory = new ContentFactory();

    var GeneralView = Backbone.View.extend({
        _initialized : false,
        _search: null,
        session: null,
        tagName: "body",
        initialize: function() {
            $('.privacy-policy').off('click.privacy').on('click.privacy', this.privacy_policy);

            this.session = arguments[0].session;
            this.favoritesView = new FavoritesView({ session: this.session });
            this.navigate();
            this.subscribe();
            this.navigateGenre();
            this.GAEvents();

        },
        render: function() {
            this.favoritesView.render();
            this.resizePlayer();
            this.returnView();
        },

        verifyPlan: function(plan,voucher, type){
            pleimo.SubscribePlan = plan;
            var planType = type;
            if (pleimo.SubscribePlan) {
                $.ajax({
                    type: "POST",
                    url: base_url + "plans/subscribe/" + pleimo.SubscribePlan
                }).done(function(data) {
                    pleimo.Subscribe = $.parseJSON(data);
                    window.pleimo = pleimo;
                    viewFactory.getView('modals/CheckoutView', function(view){
                        view.render(planType);
                    });
                });
                return;
            }

        },

        verifyVoucher: function(voucher){
            viewFactory.getView('public/GetEasyView');
          $('#mask').hide();
          $('#voucher').val(voucher);
          $('a#voucher-submit').click();

        },


        returnView: function(){
            var self = this;

            if (window.location.search.indexOf('return=') > -1) {
                $('#mask').show();
                var requestedView = Backbone.history.location.search;
                requestedView = requestedView.split('return=');
                requestedView = requestedView[1];

                if(requestedView.indexOf('&') > -1){

                    var view = requestedView.split('&');view = view[0];
                    var extra;

                    //retrieving view
                   if(view == 'checkout'){


                       if(requestedView.indexOf('extra=')){
                           extra = requestedView.split('plan=');
                           extra = extra[1];

                           type = extra.split('&extra=');
                           type = type[1];

                           extra = extra.split('&');
                           extra = extra[0];

                           self.verifyPlan(extra,'',type);
                       }

                       else{
                           extra = requestedView.split('plan=');
                           extra = extra[1];
                           var type = requestedView.split('extra=');
                           type = type[1];

                           self.verifyPlan(extra,'',type);
                       }

                   }

                    if(view == 'geteasy'){
                        extra = requestedView.split('voucher=');
                        extra = extra[1];
                        self.verifyVoucher(extra);
                    }
                }

                else{
                    //return view
                    viewFactory.getView(requestedView);
                }

            }


        },

        privacy_policy: function(e) {
            viewFactory.createView('privacy-policy');
        },
        navigateGenre: function() {
            $(document).off('.genre').on('click.genre', 'a.gender-link', function(){
                var filter = "genre=" + $(this).data('gender');

                $('.content-loading').fadeIn();
                viewFactory.createView('artists', function(view) {
                    view.render(filter);
                });

                Backbone.history.navigate('/artists', {trigger: false});
            });
        },
        navigate: function() {
            var that = this;

            $('body').off('click.load').on('click.load','.load', function(e) {
                e.preventDefault();

                if (that._search) {
                    that._search.close();
                }

                // URL without parameters
                var uri = location.pathname.substr(1);
                uri = (uri.indexOf('/') === 0) ? uri.substr(1) : uri.split('?')[0];
                uri = (uri.indexOf('?') == -1) ? uri : uri.split('?')[0];

                viewFactory.setURI(uri);

                var $target = $(e.currentTarget);
                var page = $target.data('href');


                //if ( (uri != page) && (page != 'home') )  // if same page except home
                $('.content-loading').fadeIn();

                $(document).off('View.loaded').on('View.loaded', function(e) {
                    $('.content-loading').fadeOut();
                    if (window.DEBUG) {
                        console.log('View.loaded');
                        console.log(e);
                    }
                });

                // process form data
                var form = $target.data('form');
                var method = $target.data('method');
                var callback = ($target.data('callback')) ? $target.data('callback') : null ;

                if (form) {
                    GA.trackEvent('form', 'click', { 'page': page});
                    viewFactory.loadTemplate(page, callback, {method: method, form: form, cache: false});

                    return false;
                }

                if (uri == page) $('.content-loading').fadeOut();

                GA.trackLoad(e.currentTarget);
                Backbone.history.navigate(page, {trigger: true});

                return false;
            });
        },
        resizePlayer: function(){

            $(window).on('resize', function() {

                var BOX = 260;
                var MENU = 150;
                var width = window.viewportSize.getWidth();
                var qty = Math.floor((width - MENU) / BOX);
                qty = (qty === 0) ? Math.floor((width - 64) / BOX) : qty;
                var w = qty * BOX;
                var wMENU = w + MENU;



                $('.player .wrapper').width(wMENU);
                $('.player .progress-bar').width(wMENU - 370);
                $('.player .music-player-rating').css({left: wMENU - 105 + 'px'});
            });

            $(window).trigger('resize');
        },
        subscribe: function() {
            var that = this;
            $(document).off('click.subscribe').on('click.subscribe', '.subscribe', function() {
                var plan = $(this).data("subscribe");
                GA.trackEvent('Subscribe', 'Click', { 'eventLabel' : plan });

                that.session.checkAuth({
                    success: function() {
                        $.ajax({
                            type: "POST",
                            url: base_url + "plans/subscribe/" + plan
                        }).done(function(data) {
                            pleimo.Subscribe = $.parseJSON(data);
                            pleimo.SubscribePlan = plan;
                            window.pleimo = pleimo;

                            // CHECK OUT
                            viewFactory.getView('modals/CheckoutView');
                        });
                    },
                    error: function() {
                        pleimo.SubscribePlan = plan;
                        window.pleimo = pleimo;

                        // SIGN IN
                        viewFactory.getView('modals/SignInView');
                    }
                });

            });
        },
        GAEvents: function() {
            $(document).off('click.ga')
                .on('click.ga', 'article#download a', function(e) {
                    // plans -> download apple / android
                    GA.trackEvent('Download', 'Click', { 'eventLabel' : 'Download: '+$(e.currentTarget).attr('title') });
                })
                .on('click.ga', 'pull-right#download a', function(e) {
                    // footer -> fb twitter youtube instagram
                    GA.trackEvent('Download', 'Click', { 'eventLabel' : 'Download: '+$(e.currentTarget).attr('title') });
                })
                .on('click.ga', 'a.share', function(e) {
                    // share buttons
                    GA.trackEvent('Share', 'Click', { 'eventLabel' : 'Share: '+$(e.currentTarget).find('i.share').data('permalink') });
                })
                .on('click.ga', '.popover-content .social a', function(e) {
                    // share buttons
                    GA.trackEvent('Share', 'Click', { 'eventLabel' : $(e.currentTarget).attr('class') + ': ' + $(e.currentTarget).parents('.share').find('i.share').data('permalink') });
                })
                .on('click.ga', 'a[class*=footer]', function(e) {
                    // social buttons
                    GA.trackEvent('Social', 'Click', { 'eventLabel' : $(e.currentTarget).attr('title') });
                })
                .on('click.ga', '.popover-content .language a', function(e) {
                    // language buttons
                    GA.trackEvent('Language', 'Click', { 'eventLabel' : $(e.currentTarget).text() });
                })
                .on('click.ga', '.footer-copy a', function(e) {
                    // footer links
                    GA.trackEvent('Footer', 'Click', { 'eventLabel' : $(e.currentTarget).attr('title') });
                })
                .on('click.ga', 'a.signin-button', function(e) {
                    if ($(e.currentTarget).attr('id') == "btn-login") {
                        // click Register
                        GA.trackEvent('Login', 'Click', { 'eventLabel' : 'Enter' });
                        return;
                    }
                    // header login button
                    GA.trackEvent('Header', 'Click', { 'eventLabel' : 'Login' });
                })
                .on('click.ga', 'a.signup-button', function(e) {
                    // register login button
                    GA.trackEvent('Login', 'Click', { 'eventLabel' : 'Register' });
                })
                .on('click.ga', 'a.facebook-oauth', function(e) {
                    // facebook login
                    GA.trackEvent('Login', 'Click', { 'eventLabel' : 'Facebook' });
                })
                .on('click.ga', '#form-login input.submit', function(e) {
                    // email login
                    GA.trackEvent('Login', 'Click', { 'eventLabel' : 'Email' });
                })
                .on('click.ga', 'a.open-coupon', function(e) {
                    // open coupon
                    GA.trackEvent('Coupon', 'Click', { 'eventLabel' : 'Open' });
                })
                .on('click.ga', 'input.coupon-check', function(e) {
                    // open coupon
                    GA.trackEvent('Coupon', 'Click', { 'eventLabel' : 'Use' });
                })
                .on('click.ga', 'input#payment', function(e) {
                    // open coupon
                    GA.trackEvent('PayPal', 'Click', { 'eventLabel' : 'PayPal' });
                })
                .on('click.ga', 'section.products-list li', function(e) {
                    // artist product
                    GA.trackEvent('Product', 'Click', { 'page': Backbone.history.location.pathname, 'eventLabel' : 'Product: ' +$(e.currentTarget).data('id') + ' [' + $(e.currentTarget).find('img').attr('alt') + ']' });
                })
                .on('click.ga', 'a.btn-cart', function(e) {
                    // click buy product
                    var modal = $(e.currentTarget).parents('.detail-product');
                    GA.trackEvent('Product', 'Buy', { 'page': Backbone.history.location.pathname, 'eventLabel' : 'Product: ' + modal.find('#artist_product').val() + ' [' +  modal.find('#name').val() + ']'});
                })
                .on('click.ga', '.detail-product .nav-tabs a', function(e) {
                    // click Product - Tabs
                    var modal = $(e.currentTarget).parents('.detail-product');
                    GA.trackEvent('Product', 'Tab', { 'page': Backbone.history.location.pathname, 'eventLabel': 'Product: ' + modal.find('#artist_product').val() + ' [' +  modal.find('#name').val() + '] ' + $(e.currentTarget).attr('href')});
                })
                .on('click.ga', 'input.btn-calcfrete', function(e) {
                    // click calc frete
                    GA.trackEvent('Cart', 'Frete', { });
                })
                .on('click.ga', 'a.btn-remover', function(e) {
                    // click remover cart
                    GA.trackEvent('Cart', 'Remove', { 'eventLabel' : 'Product: '+$(e.currentTarget).data('token') });
                })
                .on('click.ga', 'a.btn-coupon', function(e) {
                    // click cart coupon
                    GA.trackEvent('Cart', 'Coupon', { });
                })
                .on('click.ga', 'section#social_youtube li a', function(e) {
                    // click Open Video - Rock in Rio
                    GA.trackEvent('Video', 'Open', { 'eventLabel': 'Rock In Rio: '+ $(e.currentTarget).attr('title') });
                })
                .on('click.ga', 'section#social_instagram a', function(e) {
                    // click Instagram - Rock in Rio
                    GA.trackEvent('Instagram', 'Open', { 'eventLabel': 'Rock In Rio: '+ $(e.currentTarget).attr('href') });
                })
                .on('click.ga', 'section#social_other li a', function(e) {
                    // click Instagram - Rock in Rio
                    GA.trackEvent('Social', 'Click', { 'eventLabel': 'Rock In Rio: '+ $(e.currentTarget).attr('title') });
                });
        },
        setSearch: function(view) {
            this._search = view;
        }

    });

    return GeneralView;
});
