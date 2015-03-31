define(function(require){
    "use strict";

    var Backbone = require('backbone');
    var ga = window.ga;

    var GA = {
        pageView: function(uri) {
            uri = (uri) ? uri : Backbone.history.getFragment();
            var landing = ((uri === "" || uri == "home") && ($('#content').hasClass("landing")));
            var url = (landing) ? 'landing' : uri;
            ga('send', 'pageview', { page: Backbone.history.root + url });
        },
        trackEvent: function(category, action, params) {
            params = params || {};
            ga('send', 'event', category, action, params);
        },
        trackLoad: function(el) {
            var $el = $(el);
            var page = $el.data('href');

            if ( ($el.parents('.footer-nav').length == 1) || ($el.parents('.footer-copy').length == 1) ) {
                this.trackEvent('Footer', 'Click', { 'page' : page , 'eventLabel' : $el.attr('title')});
                return;
            }

            if ($el.parents('.menuwrapper').length == 1)  {
                this.trackEvent('Header', 'Click', { 'page' : page , 'eventLabel' : 'Menu: ' + $el.attr('title')});
                return;
            }

            if ($el.parents('.logo').length == 1)  {
                this.trackEvent('Header', 'Click', { 'page' : page , 'eventLabel' : 'Logo' });
                return;
            }

            if ($el.parents('#sidebar').length == 1)  {
                this.trackEvent('Sidebar', 'Click', { 'page' : page , 'eventLabel' : $el.text() });
                return;
            }

            if ($el.data('href') == "cart")  {
                this.trackEvent('Cart', 'Click', { 'page' : Backbone.history.location.pathname, 'eventLabel' : 'Cart' });
                return;
            }

            this.trackEvent('Nav', 'Click', { 'page' : page , 'eventLabel' : $el.attr('title')});
        }
    };

   return GA;
});