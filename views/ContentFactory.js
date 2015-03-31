// ContentFactory.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        _               = require('underscore'),
        Backbone        = require('backbone'),
        GA              = require('gga');

    var base_url = window.base_url;
    var LazyLoader = function(type) {
        this.type = type;
    };

    _.extend(LazyLoader.prototype, {
        get: function() {
            var fileNames = Array.prototype.slice.call(arguments);
            var dfd = $.Deferred();
            var path = this.type + "/";

            fileNames = _.map(fileNames, function(fileName){
                return path + fileName;
            });

            try {
                require(fileNames, function() {
                    dfd.resolve.apply(dfd, arguments);
                });
            } catch(e) {
                //console.log("REQUIREJS PROBLEM");
                //console.log(e);
                //console.log(fileNames);
                require(fileNames, function() {
                    dfd.resolve.apply(dfd, arguments);
                });
            }
            return dfd.promise();
        }
    });

    /**
     * Singleton ContentFactory
     * @returns {ContentFactory|*}
     * @constructor
     */
    var ContentFactory = function() {
        this.uri = '';

        if (ContentFactory._instance) {
            return ContentFactory._instance;
        }
        ContentFactory._instance = this;

        this.getInstance = function () {
            return ContentFactory._instance || new ContentFactory();
        };

        var views = new LazyLoader('views');

        this.loadedViews = {};
        this.cachedTemplates  = {};

        this.setURI = function(uri) {
            this.loadTitle(uri);
            this.uri = uri;
        };

        this.getURI = function() {
            return this.uri;
        };

        this.loadTitle = function(uri) {

            //console.log('loadTitle: '+uri);
            this.xml = null;
            this.loaded = false;

            var that = this;

            $.ajax({
                url: window.base_url + 'application/www/language/page_title.xml',
                success: function(data) {
                    that.loaded = true;
                    that.xml = data;

                    uri = (uri.search(/dashboard\/mystore\/\d/) > -1) ? 'dashboard/mystore' : uri;
                    uri = (uri.search(/dashboard\/settings\/\d/) > -1) ? 'dashboard/settings' : uri;
                    uri = (uri.search(/orders\/detail\/MO*/gi) > -1) ? 'orders/detail' : uri;
                    uri = (uri.search(/artist\/edit\/\d/) > -1) ? 'artist/edit' : uri;
                    uri = (uri.search(/dashboard\/\d/) > -1) ? 'dashboard' : uri;
                    uri = (uri.search(/dashboard\/fans\/\d/) > -1) ? 'dashboard/fans' : uri;

                    uri = uri.replace(/\//g,"-");

                    var txtxml = "";
                    try {

                        txtxml = $(that.xml).find('data text#' + uri + ' ' + window.lang).text();
                    } catch (e) {
                        txtxml = "";
                    }
                    var title = (txtxml === '') ? "Pleimo - #pttp!" : txtxml;

                    if (window.title) {
                        title = window.title || title;
                        window.title = null;
                    }

                    document.title = title;
                }
            });
        };

        this.getView = function(url, callback) {
            if (window.DEBUG) console.log('getView:' + url);
            //this.callback = callback;
            var that = this;

            if (this.loadedViews[url] !== undefined) {
                var View = this.loadedViews[url];
                var view = new View();

                if (typeof (callback) == "function") {
                    callback(view);
                } else {
                    view.render();
                }
            } else {
                var getView = views.get(url);
                $.when(getView).then(function(View) {
                    //console.log(arguments);
                    var view = new View();
                    that.loadedViews[url] = View;

                    if (typeof (callback) == "function") {
                        callback(view);
                    } else {
                        view.render();
                    }
                });
            }
        };

        this.createView = function(type, callback) {

            switch(type) {
                case 'forgot/recovery':
                    this.getView('forgot/RecoveryView', callback);
                    break;
                case 'faq':
                    this.getView('public/FaqView', callback);
                    break;

                case 'home':
                    this.getView('home/HomeView', callback);
                    break;

                case 'about':
                    this.getView('public/AboutView', callback);
                    break;

                case 'artists':
                    this.getView('ReleasesView', callback);
                    break;

                case 'radio':
                    this.getView('RadiosView', callback);
                    break;

                case 'landing':
                    this.getView('home/LandingView', callback);
                    break;

                case 'settings/save':
                case 'profile':
                    //console.log('createView');
                    this.getView('profile/ProfileView', callback);
                    break;

                case 'profile/pass':
                    this.getView('profile/ProfilePassView', callback);
                    break;

                case 'profile/delete':
                    this.getView('profile/ProfileDeleteView', callback);
                    break;

                case 'settings/delete':
                    this.getView('profile/ProfileDeleteLogoutView', callback);
                    break;

                case 'profile/playlists':
                    this.getView('profile/PlaylistsView', callback);
                    break;

                case 'plans':
                    this.getView('public/PlansView', callback);
                    break;

                case 'plans/artists':
                    this.getView('public/PlansArtistView', callback);
                    break;

                case 'contact':
                    this.getView('public/ContactView', callback);
                    break;

                case 'contact/advertise':
                    this.getView('public/ContactAdvertiseView', callback);
                    break;

                case 'contact/complaint':
                    this.getView('public/ContactComplaintView', callback);
                    break;

                case 'contact/records':
                    this.getView('public/ContactRecordsView', callback);
                    break;

                case 'contact/work':
                    this.getView('public/ContactWorkView', callback);
                    break;

                case 'products':
                    this.getView('artist/ProductsView', callback);
                    break;

                case 'orders':
                    this.getView('orders/OrdersView', callback);
                    break;

                case 'orders/detail':
                    this.getView('orders/OrdersDetails', callback);
                    break;

                case 'cart':
                    this.getView('cart/CartView', callback);
                    break;

                case 'cart/payment':
                    this.getView('cart/CartPaymentView', callback);
                    break;

                case 'cart/process':
                    this.getView('cart/CartProcessView', callback);
                    break;

                case 'dashboard':
                    this.getView('dashboard/DashboardGeneralView', callback);
                    break;

                case 'dashboard/mystore':
                    this.getView('dashboard/DashboardMyStoreView', callback);
                    break;

                case 'dashboard/settings':
                    this.getView('dashboard/DashboardSettingsView', callback);
                    break;

                case 'dashboard/fans':
                    this.getView('dashboard/DashboardFansView', callback);
                    break;

                case 'artist/edit':
                    this.getView('artist/ArtistEditMainSettingsView', callback);
                    break;

                case 'artist/edit/bio':
                case 'artist/edit/save':
                    this.getView('artist/ArtistEditBioView', callback);
                    break;

                case 'artist/edit/albums':
                case 'artist/bio/edit/save':
                    this.getView('artist/ArtistEditAlbumView', callback);
                    break;

                case 'artist/edit/products':
                    this.getView('artist/ArtistEditProductsView', callback);
                    break;

                case 'register/artist':
                    this.getView('register/artist/RegisterArtistMainSettingsView', callback);
                    break;

                case 'complete/artist/bio':
                    this.getView('register/artist/RegisterArtistBioView', callback);
                    break;

                case 'register/artist/save':
                case 'artist/edit/bio':
                    this.getView('register/artist/RegisterArtistBioView', callback);
                    break;

                case 'complete/artist/albums':
                case 'register/artist/save/bio':
                    this.getView('register/artist/RegisterArtistAlbumView', callback);
                    break;

                case 'complete/artist/products':
                    this.getView('register/artist/RegisterArtistProductsView', callback);
                    break;

                case 'privacy-policy':
                    this.getView('modals/PrivacyPolicyView', callback);
                    break;

                case 'support':
                    this.getView('modals/SupportView', callback);
                    break;

                case 'cartModal':
                    this.getView('modals/ProductsPaymentCart', callback);
                    break;

                case 'subscribe':
                    this.getView('modals/SubscribeView', callback);
                    break;

                case 'aboutDetails':
                    this.getView('modals/AboutDetailsView', callback);
                    break;

                case 'genders':
                    this.getView('modals/GendersView', callback);
                    break;

                case 'dashboard/mystore/products':
                case 'allproducts':
                    this.getView('modals/AllProductsView', callback);
                    break;

                case 'termsArtist':
                    this.getView('modals/TermsArtistView', callback);
                    break;

                case 'bioExample':
                    this.getView('modals/BioExampleView', callback);
                    break;

                case 'bioYoutube':
                    this.getView('modals/BioYoutubeView', callback);
                    break;

                case 'cartCoupon':
                    this.getView('modals/CartCouponView', callback);
                    break;

                case 'getEasyVoucher':
                    this.getView('modals/GetEasyVoucherView', callback);
                    break;

                case 'topcharts':
                    this.getView('TopchartsView', callback);
                    break;

                case 'orders/cancelled':
                    this.getView('orders/OrdersCancelledView', callback);
                    break;

                case 'orders/pending':
                    this.getView('orders/OrdersPendingView', callback);
                    break;

                case 'profile/favorites':
                    this.getView('profile/ProfileFavoritesView', callback);
                    break;

                case 'geteasy':
                    this.getView('public/GetEasyView', callback);
                    break;

                case 'rockinrio':
                    this.getView('public/RockinrioView', callback);
                    break;

                case '404':
                    this.getView('public/Error404', callback);
                    break;

                case 'terms/artists':
                    this.getView('public/TermsArtistView', callback);
                    break;

                default:
                   // this.loadTitle('artist');

                    //console.log('---- artist view: '+ type);
                    this.getView('artist/ArtistPageView', callback);

                    break;
            }
        };

        this.loadTemplate = function(uri, callback, params) {

            params = (params) ? params : {};
            var method = (params.method) ? params.method : 'GET';
            var data = (params.form) ? ($('#' + params.form).serialize()) : null;

            if ('data' in params) {
                data = params.data;
            }

            var cache = ('cache' in params) ? params.cache : (data) ? false : true;
            var triggerLoaded = ('triggerLoaded' in params) ? params.triggerLoaded : true;

            uri = (uri.indexOf('/') === 0) ? uri.substr(1) : uri;

            if (window.DEBUG) console.log('ContentFactory.loadTemplate:' + uri);

            if (typeof (this.cachedTemplates[uri]) === 'undefined' || !cache) {
                var that = this;

                $.ajax({
                    method: method,
                    url: base_url + uri,
                    data: data,
                    statusCode: {
                        200: function(data) {
                            that.cachedTemplates[uri] = { data: data, status: 200 };
                            if (callback && ('success' in callback)) callback.success(data, 200);

                            that.loadTitle(uri);

                            if (triggerLoaded) {
                                if (window.DEBUG) console.log("View.loaded trigger: "+ uri);
                                $(document).trigger('View.loaded');
                            }
                        },
                        203: function() {
                            that.cachedTemplates[uri] = { data: data, status: 203 };
                            if (callback && ('error' in callback)) callback.error(data, 203);

                            $('.content-loading').fadeIn();
                            Backbone.history.navigate(base_url + "home?signin=" + window.location.pathname, {trigger: true});
                        },
                        404: function() {
                            $.ajax({
                                type: "POST",
                                url: base_url + "404"
                            }).done(function(data) {
                                that.cachedTemplates[uri] = { data: data, status: 404 };
                                if (callback && ('error' in callback)) callback.error(data, 404);

                                if (window.DEBUG) console.log("View.loaded trigger: "+ uri);
                                $(document).trigger('View.loaded');
                            });
                        },
                        500: function() {
                            $.ajax({
                                type: "POST",
                                url: base_url + "500"
                            }).done(function(data) {
                                that.cachedTemplates[uri] = { data: data, status: 500 };
                                if (callback && ('error' in callback)) callback.error(data, 500);

                                $(".content-loading").hide();

                                // abre modal de erro
                                $('.modal').hide();
                                $("body").append(data);
                                $('.modal.error a').on('click', function() {
                                    $(this).parent().parent().remove();
                                    // closeMask();
                                });
                            });
                        }
                    }
                });
            } else {
                if (window.DEBUG)
                    console.log('cached: '+uri);

                if (callback) {
                    var cached = this.cachedTemplates[uri];

                    if (cached.status == 200) {
                        if ('success' in callback) callback.success(cached.data, cached.status);
                    } else {
                        if ('error' in callback) callback.error(cached.data, cached.status);
                    }
                    if ('complete' in callback) callback.complete(cached.data, cached.status);

                    if (triggerLoaded) {
                        if (window.DEBUG) console.log("View.loaded trigger: "+ uri);
                        $(document).trigger('View.loaded');
                    }
                }

            }
        };

        this.formSubmit = function($target) {
            var id_form = $target.data('form');
            var method = $target.data('method');
            var uri = $target.data('href');
            var data = $('#' + id_form).serialize();

            GA.trackEvent('form', 'click', { 'page': uri });

            $('.content-loading').fadeIn();
            $(document).off('View.loaded');

            $.ajax({
                method: method,
                url: base_url + uri,
                data: data,
                success: function(result) {

                    result = JSON.parse(result);

                    if (typeof result.uri !== "undefined")
                        Backbone.history.navigate(result.uri, {trigger: true});

                    $(document).on('View.loaded', function() {
                        $('.content-loading').fadeOut();
                    });
                }
            });
        };
    };

    return ContentFactory;
});