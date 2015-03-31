// SignUpView.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        ModalModel      = require('models/ui/ModalModel'),
        ModalView       = require('views/ui/ModalView'),
        ContentFactory  = require('views/ContentFactory'),
        GA              = require('gga');
        require('validate');
        require('validatePleimo');

    var pleimo = window.pleimo;
    var base_url = window.base_url;
    var lang = window.lang;

    var viewFactory = new ContentFactory();

    var SignUpView = ModalView.extend({
        initialize: function() {

            this.model = new ModalModel({
                className: '.modal.login.outbox',
                content: ''
            });

            this.model.on('change:isOpen', this.toggle, this);
        },
        events: {
            "click a.btn-close": "close",
            "click a#read-terms": "userTerms"
        },


        render: function(redirect,loginType) {
            GA.pageView('signup');
            var that = this;


            redirect = (typeof redirect === 'undefined') ? window.location.search : redirect;

            $.ajax({
                type: "GET",
                url: base_url + "signup"
            }).done(function(data) {
                //$('.modal').hide();
                //$("body").append(data);
                that.setContent(data);
                that.signIn();
                that.addEvents(loginType);

            });

        },

        reloadView: function(view,extra){

            //var Backbone;

            var url = window.Backbone.history.location.href;
            var plan = pleimo.SubscribePlan;

            if(view == 'firstlogin'){

                if (pleimo.Session.get('FIRST_LOGIN') && pleimo.Session.get('SUBSCRIPTION_STATUS') == 3){
                    window.location.href = url;
                    return false;
                }

            }



            if(view == 'geteasy'){
                window.location.href = url+'?return='+view+'&voucher='+extra;
                return false;
            }


            if(view == 'plans'){
                window.location.href = url+'?return=checkout&plan=freemium&extra='+view;
                return false;
            }


            else{
                window.location.href = url+'?return='+view+'&plan='+plan;
            }


        },

        userTerms: function(e){
            viewFactory.getView('modals/UserTermsView');
        },

        signIn: function(){

            $(document).off("click.signin").on("click.signin", ".signin-button", function() {
                viewFactory.getView('modals/SignInView');
            });

        },

        addEvents: function(loginType){
            var that = this;
            var language;
            $.get(base_url+'application/www/language/signup.xml', null, function (data, textStatus) {

                if (textStatus == "success") language = data;

            }, 'xml').done(function(){

                /**
                 * Validate signup form.
                 * @author Leonardo Moreira <developer@pleimo.com>
                 */
                $("#form-register").validate({
                    errorElement : "span",
                    rules : {
                        "signup-name" : {
                            required: true
                        },
                        "signup-email" : {
                            required : true,
                            email    : true
                        },
                        "signup-passwd" : {
                            required : true
                        }
                    },

                    messages : {
                        "signup-name" : {
                            required: null
                        },
                        "signup-email" : {
                            required : null,
                            email    : null
                        },
                        "signup-passwd" : {
                            required : null
                        }
                    },

                    showErrors : function() {
                        this.defaultShowErrors();
                    },

                    submitHandler: function() {


                        if ($("#signup-terms:checked").val() != 1) {
                            $("#read-terms").css("color", "#E70F47");
                            $(".box-alert").html("<div class=\"alert alert-warning\"><span>"+$(language).find('data text[id="text-terms"] '+lang).text()+"</span></div>");
                            return false;
                        } else {
                            $("#read-terms").css("color", "#424242");
                            $(".box-alert").empty();

                        }

                        $("#form-register .alert").remove();
                        $("#form-register .submit").addClass('wait').val(null);




                        $.ajax({
                            type : "POST",
                            data : { "name" : $("#signup-name").val(), "email" : $("#signup-email").val(), "passwd" : $("#signup-passwd").val(), "redirect" : $("#signup-redirect").val() },
                            url  : base_url+"signup/create"
                        }).done(function(data){

                            data = $.parseJSON(data);
                           // var that = this;

                            if (data.message) {
                                $("#form-register").prepend("<div class=\"alert alert-warning\"><span>"+data.message+"</span></div>");
                                $("#form-register .submit").removeClass('wait').val("Cadastrar");
                            }

                            pleimo.Session.checkAuth({
                                success: function() {

                                    if(loginType === 'firstLogin'){
                                        that.reloadView('firstlogin');


                                        return false;
                                    }

                                    if (pleimo.SubscribePlan) {
                                        that.reloadView('checkout');
                                        return;
                                    }

                                    if (pleimo.Geteasy !== undefined && pleimo.Geteasy.Voucher === true)
                                    {
                                        var voucher = $("#voucher").val();
                                        that.reloadView('geteasy',voucher);
                                        return;
                                    }

                                    if ( !data.message ) {

                                        that.reloadView('plans');
                                     //   that.close();
                                        //window.top.location = base_url+data.redirect;

                                        /*$.ajax({
                                            type: "POST",
                                            url : base_url+"plans/subscribe/freemium",
                                            beforeSend : function() {
                                                $('.button.promo.save').val('').addClass('loading');
                                            },
                                            success : function(data) {

                                                pleimo.Subscribe = $.parseJSON(data);
                                                // viewFactory.getView('modals/CheckoutView');
                                                viewFactory.getView('modals/CheckoutView', function(view) {
                                                    view.render('plans');
                                                });

                                                //pleimo.Template.Checkout();

                                            }
                                        });*/
                                    }

                                },
                                error: function() {
                                    // error
                                }
                            });


                        });

                    }

                });

            });


        }


    });

    return SignUpView;
});