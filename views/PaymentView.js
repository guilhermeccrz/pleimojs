define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone');
        require('template');

    var base_url = window.base_url;
    var pleimo = window.pleimo;

    var PaymentView = Backbone.View.extend({

        trigger: function(callback) {
            var el = $('.subscribe');
            var type = el.attr("data-subscribe");
            this.getLanguage(el, type, callback);
        },

        getLanguage: function(el, type, callback){
            var paymentClick = this.paymentClick;
            var language = window.language || {};


            $.get(base_url+'application/www/language/settings.xml', null, function (data, textStatus) {
                if (textStatus == "success") language = data;
            }, 'xml').done(function(){

                $(el).click(function(){
                    paymentClick(type, callback);
                });
            });
        },

        paymentClick: function(type, callback){
            var controlClick = false;
            var plan = type;

            if (!controlClick){

                controlClick = true;

                //var plan = $(this).data("subscribe");

                if (!pleimo.Session.get("logged_in")) {
                    pleimo.Subscribe = plan;
                    pleimo.Template.Signin();
                    return false;
                }

                $.ajax({
                    type: "POST",
                    url: base_url + "plans/subscribe/" + plan
                }).done(function(data) {

                    pleimo.Subscribe = $.parseJSON(data);
                    pleimo.Template.Checkout(function(){

                       /* var profileBeginView = new ProfileBeginView();
                        profileBeginView.render();*/
                        if (callback && typeof(callback) === "function")
                            callback();

                        controlClick = false;

                    });
                });
            }
        }

    });

    return PaymentView;
});