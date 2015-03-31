// SubscribeView.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        ModalModel      = require('models/ui/ModalModel'),
        ContentFactory  = require('views/ContentFactory'),
        ModalView       = require('views/ui/ModalView');

    var pleimo = window.pleimo || {};
    var base_url = window.base_url;

    var viewFactory = new ContentFactory();
    var SubscribeView = ModalView.extend({
        initialize: function() {

            this.model = new ModalModel({
                className: '.modal.login.outbox',
                content: ''//template
            });

            this.model.on('change:isOpen', this.toggle, this);
        },
        events: {
            "click a.btn-close": "close"
        },

        signIn:function(){

            viewFactory.getView('modals/SignInView', function(view) {
                view.render();
            });

        },

        checkOut: function(){

            viewFactory.getView('modals/CheckoutView', function(view) {
                view.render();
            });

        },

        render: function(plan) {
            var that = this;

            if (!pleimo.Session.get('logged_in')) {
                pleimo.Subscribe = plan;
                //pleimo.Template.Signin();
                this.signIn();
                return false;
            }

            $.ajax({
                type: "POST",
                url: base_url + "plans/subscribe/" + plan
            }).done(function(data) {
                pleimo.Subscribe = $.parseJSON(data);
               // pleimo.Template.Checkout();
                that.checkOut();
            });
        }
    });

    return SubscribeView;
});