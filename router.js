// Filename: router.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone'),
        SessionModel    = require('models/SessionModel'),
        ContentFactory  = require('views/ContentFactory'),
        GA              = require('gga');
    require('template');

    var viewFactory = new ContentFactory();
    var session = new SessionModel();

    var SidebarView = require('views/ui/SidebarView');
    var sidebar = new SidebarView({session: session});



    var GeneralView = require('views/ui/GeneralView');
    var general = new GeneralView({session: session});

    var pleimo = window.pleimo || {};
    pleimo.Session = session;
    window.pleimo = pleimo;

    var ga = window.ga;
    var lang = window.lang;

    var load = {
        general: function() {
            general.render();
        },
        sidebar: function(uri) {
            sidebar.render(uri);
        },
       /* menu: function(uri) {
            menu.render(uri);
        },*/
        default: function(uri) {
            //console.log('view '+uri);
            uri = (uri.indexOf('/') === 0) ? uri.substr(1) : uri.split('?')[0];
            uri = (uri.indexOf('?') == -1) ? uri : uri.split('?')[0];
            // order/details/MO...
            uri = (uri.search(/orders\/detail\/MO*/gi) > -1) ? 'orders/detail' : uri;
            uri = (uri.search(/artist\/edit\/\d/) > -1) ? 'artist/edit' : uri;
            uri = (uri.search(/dashboard\/\d/) > -1) ? 'dashboard' : uri;
            uri = (uri.search(/dashboard\/mystore\/\d/) > -1) ? 'dashboard/mystore' : uri;
            uri = (uri.search(/dashboard\/settings\/\d/) > -1) ? 'dashboard/settings' : uri;
            uri = (uri.search(/dashboard\/fans\/\d/) > -1) ? 'dashboard/fans' : uri;
           // uri = (uri.search(/forgot\/recovery\/?token=^\w+$/) > -1) ? 'forgot/recovery' : uri;
            //console.log('view '+uri);
            viewFactory.setURI(uri);

            this.general();

            var self = this;
            session.checkAuth({
                success: function() {
                    if (uri == 'home' || uri === '') {
                        viewFactory.createView('home');

                    } else {
                        viewFactory.createView(uri);

                        if(uri=='geteasy'){
                            self.general();
                        }

                    }

                    viewFactory.getView('search/SearchView', function(view) {
                        view.render();
                        general.setSearch(view);
                    });

                    var MenuView = require('views/ui/MenuView');
                    new MenuView({session: session});
                }, error: function() {
                    if (uri == 'home' || uri === '') {
                        if (Backbone.history.location.search.indexOf("signin") > 0) viewFactory.getView('modals/SignInView');

                        viewFactory.createView('landing');
                    } else {
                        viewFactory.createView(uri);
                    }

                    var MenuView = require('views/ui/MenuView');
                    new MenuView({session: session});
                }
            });
        }
    };

    var AppRouter = Backbone.Router.extend({
        routes: {
            '*actions': 'default'
        },

        default: function(actions) {
            //console.log('route:default');

            var uri = location.pathname.substr(1);

            load.default(uri);
        }
    });

    return {
        initialize: function() {
            var appRouter = new AppRouter();

            Backbone.history.start({ pushState: true });
            Backbone.history.on("route", function() {
                GA.pageView();
            });
            ga('set', 'language', lang);
            ga('require', 'displayfeatures');
            GA.pageView();

            $(document).off('View.loaded').on('View.loaded', function() {
                if (window.DEBUG) console.log('on View.loaded');
                $('.content-loading').fadeOut();
                //$(document).scrollTop(0);
            });


            return appRouter;
        }
    };
});