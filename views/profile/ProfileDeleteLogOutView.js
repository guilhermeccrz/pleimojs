define(function(require){
    "use strict";

    var $                    = require('jquery'),
        Backbone             = require('backbone');

    var base_url = window.base_url;
    var pleimo = window.pleimo || {};

    var ProfileDeleteViewLogOutView = Backbone.View.extend({
        el: "#main",

        render: function(){

            var that = this;

            $.ajax({
                type: "GET",
                url: base_url + "settings/delete"
            }).complete(function() {
                that.logOut();
            });

        },

        logOut: function(){
            $.ajax({
                type: "GET",
                url: base_url + "logout"
            }).done(function() {
                pleimo.Session.clear();
                window.top.location = base_url;
            });

        }
    });

    return ProfileDeleteViewLogOutView;
});
