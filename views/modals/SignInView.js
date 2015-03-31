// SignInView.js
define(function(require){
    "use strict";

    var $           = require('jquery'),
        ContentFactory  = require('views/ContentFactory'),
        ModalModel      = require('models/ui/ModalModel'),
        ModalView       = require('views/ui/ModalView'),
        GA              = require('gga');

    require('validate');
    require('validatePleimo');

    var pleimo = window.pleimo || {};
    var base_url = window.base_url;
    var lang = window.lang;
    var FB = window.FB;
    var Backbone = window.Backbone;

    var viewFactory = new ContentFactory();
    var returnType;

    var SignInView = ModalView.extend({
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

        render: function(state, redirect, ReturnType, signupType) {
            GA.pageView('signin');
            returnType = ReturnType;
            var that = this;

            redirect = (typeof redirect === 'undefined') ? window.location.search : redirect;

            $.ajax({
                type: "GET",
                url: base_url + "signin"
            }).done(function(data) {
                that.setContent(data);
                that.facebookAut(returnType);
                that.signUp(signupType);
                that.forgot();
                that.addEvents(returnType);
            });

        },

        reloadView: function(view,extra){

            var url = Backbone.history.location.href;
            var plan = pleimo.SubscribePlan;

          /*  if (pleimo.Session.get('FIRST_LOGIN') && pleimo.Session.get('SUBSCRIPTION_STATUS') == 3){
                window.location.href = url;
                return false;
            }*/


            if(view == 'geteasy'){
                window.location.href = url+'?return='+view+'&voucher='+extra;
                return false;
            }

            if(view == 'products'){
                window.location.href = url+'/product/'+extra;
                return false;
            }

            else{
                window.location.href = url+'?return='+view+'&plan='+plan;
            }




        },

        forgot:function(){
            $(document).off("click.remember").on("click.remember", ".remember-button", function() {
                viewFactory.getView('modals/ForgotView');
            });
        },

        subscribe: function(plan){
            viewFactory.getView('modals/SubscribeView', function(view) {
                view.render(plan);
            });
        },

        signUp: function(signupType){
            $(document).off("click.signup").on("click.signup", ".signup-button", function() {

                viewFactory.getView('modals/SignUpView',function(view){

                    view.render('',signupType);

                });
            });
        },



        addEvents: function(returnType){
            var that = this;
            var language;

            $.get(base_url+'application/www/language/signin.xml', null, function (data, textStatus) {

                if (textStatus == "success") language = data;

            }, 'xml').done(function(){

                $("#form-login").validate({

                    rules:{
                        "signin-email" : {required : true, email    : true },
                        "signin-passwd" : {required : true}
                    },

                    messages:{
                        "signin-email" :{
                            required : null,
                            email    : null
                        },
                        "signin-passwd" : {
                            required  : null,
                            minlength : 3
                        }
                    },

                    showErrors : function() {
                        this.defaultShowErrors();
                    },

                    submitHandler: function() {

                        $("#form-login .alert").remove();
                        $("#form-login .submit").addClass('wait').val(null);

                        if ( ! $("#signin-redirect").val()) $("#signin-redirect").val(window.location.pathname);

                        $.ajax({
                            type : "POST",
                            data : { "email" : $("#signin-email").val(), "passwd" : $("#signin-passwd").val(), "redirect" : $("#signin-redirect").val() },
                            url  : base_url+"signin/auth"
                        }).done(function(data){
                            data = $.parseJSON(data);



                            if (data.message) {
                                $("#form-login").prepend("<div class=\"alert alert-warning\"><span>"+data.message+"</span></div>");
                                $("#form-login .submit").removeClass('wait').val($(language).find('data text[id="login-login"] '+lang).text());

                                return;
                            }

                            pleimo.Session.checkAuth({
                                success: function() {
                                    if (pleimo.SubscribePlan) {
                                        that.reloadView('checkout');
                                        return;
                                    }

                                    if (typeof returnType !== "undefined") {
                                        console.log('loging');
                                        that.reloadView('products',returnType);
                                        return;
                                    }



                                    if ( (typeof(pleimo.Geteasy) !== "undefined") && (pleimo.Geteasy.Voucher === true) ) {
                                        var voucher = $("#voucher").val();
                                        that.reloadView('geteasy',voucher);
                                        return;
                                    }


                                    if ( !data.message ) {
                                        window.top.location = base_url+data.redirect;
                                    }

                                    else{
                                        Backbone.history.loadUrl();
                                        return;
                                    }

                                }
                            });

                        });

                    }

                });


                $("#form-remember").validate({

                    rules:{
                        "email-remember" : {
                            required : true,
                            email    : true
                        }
                    },

                    messages:{
                        "email-remember" : {
                            required : null,
                            email    : null
                        }
                    },

                    showErrors : function() {
                        this.defaultShowErrors();
                    },

                    submitHandler: function() {

                        $("#form-remember .alert").remove();
                        $("#form-remember .submit").addClass('wait').val(null);

                        $.ajax({
                            type : "POST",
                            data : { "email-remember" : $("#email-remember").val() },
                            url  : base_url+"forgot/send"
                        }).done(function(data){

                            data = $.parseJSON(data);

                            if (data.status == "1") $("#form-remember").prepend("<div class=\"alert alert-success\"><span>"+data.message+"</span></div>");
                            if (data.status == "0") $("#form-remember").prepend("<div class=\"alert alert-warning\"><span>"+data.message+"</span></div>");

                            $("#form-remember .submit").removeClass('wait').val($(language).find('data text[id="text-send"] '+lang).text());

                        });

                    }

                });

            });

        },


        facebookAut: function(returnType){
            var that = this;
            $(document).off('click.facebook').on('click.facebook', '.facebook-oauth', function(e) {
                FB.login(function(response) {

                    if (response.authResponse) {
                        var pathname = (window.location.pathname).replace(/^\s+/, "/").replace(/^\/|\/$/g, '');
                        var qbuild = (pathname !== "") ? "?signin=" + pathname : "?signin=home";

                        if (window.location.search) qbuild = window.location.search;

                        $(".facebook-oauth").addClass("wait").html("");

                        $.ajax({
                            type: "POST",
                            url: base_url + 'signin/connect' + qbuild
                        }).done(function(data) {
                            data = $.parseJSON(data);

                            pleimo.Session.checkAuth({
                                success: function() {



                                    if (pleimo.SubscribePlan) {
                                            that.reloadView('checkout');
                                        return;
                                    }

                                    if (typeof returnType !== "undefined") {
                                        that.reloadView('products',returnType);
                                        return;
                                    }

                                    if ( (typeof(pleimo.Geteasy) !== "undefined") && (pleimo.Geteasy.Voucher === true) ) {
                                        var voucher = $("#voucher").val();

                                        that.reloadView('geteasy',voucher);


                                        return;
                                    }


                                    if (data.redirect) {

                                        window.location.pathname = data.redirect;
                                    }

                                    else{
                                        Backbone.history.loadUrl();
                                        return;
                                    }
                                }
                            });
                        }).fail(function( jqXHR, textStatus, errorThrown ) {
                                that.close();

                                GA.pageView('500');
                                viewFactory.getView('modals/Error500');
                            });
                    }
                }, {
                    scope: 'publish_stream, user_about_me, email, user_likes, friends_likes'
                });

            });
        }
    });

    return SignInView;
});