define(function(require) {
    "use strict";

    var $               = require('jquery'),
        _               = require('underscore'),
        Backbone        = require('backbone'),
        ContentFactory  = require('views/ContentFactory'),
        GA              = require('gga');

    var viewFactory = new ContentFactory();

    var pleimo = window.pleimo || {};
    var lang = window.lang;

    pleimo.Geteasy = {
        TYPE: {
            STREAMING: 'STREAMING',
            ARTIST: 'ARTIST'
        },
        planType: '',
        Voucher: false,

        Init: function() {
            var that = this;
            this.planType = this.TYPE.STREAMING;

            $('#voucher').off('.voucher').on('blur.voucher', function() {
                if ($(this).val().length > 0) {
                    GA.trackEvent('geteasy:voucher', 'voucher', { 'page': 'geteasy' });
                } else {
                    GA.trackEvent('geteasy:voucher', 'empty', { 'page': 'geteasy' });
                }
            });

            $("#voucher-submit").off('.voucher').on('click.voucher', function() {
                $(this).css("height","18").addClass('wait').empty();

                GA.trackEvent('geteasy:submit', 'click', { 'page': 'geteasy' });
                that.Submit();
            });

            $('.details').on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
                that.planType = that.TYPE.STREAMING;

                if ($(e.target).attr("href") == "#artist") {
                    that.planType = that.TYPE.ARTIST;
                }
                GA.trackEvent('geteasy:tab['+that.planType+']', 'click', { 'page': 'geteasy' });
            });
        },

        Submit: function() {
            var that = this;

            var voucher = $("#voucher").val();

            if (voucher === undefined || voucher === '' || voucher == $("#voucher").attr('placeholder')) {
                that._error();

                return;
            }

            pleimo.Session.checkAuth({
                success: function() {
                    pleimo.Geteasy.Voucher = false;

                    GA.trackEvent('geteasy:voucher', 'logged', { 'page': 'geteasy' });
                    that.voucher_validation(voucher);
                },
                error: function() {
                    pleimo.Geteasy.Voucher = true;

                    viewFactory.getView('modals/SignInView');

                    GA.trackEvent('geteasy:voucher', 'signin', { 'page': 'geteasy' });
                    var text = $(pleimo.Language.geteasy).find('data text[id="geteasy-voucher-submit-button"] '+lang).text();

                    $("#voucher-submit")
                        .removeClass('wait')
                        .html(text);
                }
            });
        },

        voucher_validation: function(voucher) {
            pleimo.Geteasy.Voucher = false;

            $.ajax({
                type : "POST",
                url  : window.base_url+"geteasy/voucher-validation",
                dataType: "json",
                data: {
                    voucher: voucher
                },
                success: function(data) {
                    if (data.success === 0) {
                        viewFactory.getView('modals/GetEasyVoucherView');

                        GA.pageView('geteasy/invalid');
                        setTimeout(function() {
                            var text = $(pleimo.Language.geteasy).find('data text[id="geteasy-voucher-submit-button"] '+lang).text();

                            $("#voucher-submit")
                                .removeClass('wait')
                                .html(text);
                        }, 1000);
                        return;
                    }

                    pleimo.Geteasy.Voucher = data;

                    GA.pageView('geteasy/checkout');
                    viewFactory.getView('modals/CheckoutView', function(view) {
                        view.render('geteasy');
                    });
                }
            });
        },

        Checkout: function() {
            return pleimo.Geteasy.Modal.load(pleimo.Geteasy.Modal.geteasy,"geteasy/payment_modal", true);
        },

        _error: function() {
            var text = $(pleimo.Language.geteasy).find('data text[id="geteasy-voucher-submit-button"] '+lang).text();

            $("#voucher-submit")
                .removeClass('wait')
                .html(text);

            $("#voucher").css({
                'background-color':'#FFE5E5',
                'border-color': '#FF0000',
                'position':'relative'
            });

            for(var iter=0;iter<(4+1);iter++)
            {
                $("#voucher").animate({ left: ((iter%2===0 ? 10 : 10*-1))}, 50);
            }//for

            $("#voucher").animate({ left: 0},50);

            $("#voucher").on('change', function(e){
                var voucher = ($(this).val()).length;

                if (voucher >=32)
                {
                    $("#voucher").
                        css('background-color','#f5f5f5').
                        css('border-color','#dcdcdc');
                }

            });
        }
    };

    window.pleimo = pleimo;

    var GetEasyView = Backbone.View.extend({

        el: "#main",
        template: '/geteasy',

        initialize: function(){
        },

        render: function(){
            //console.log('geteasy');
            var that = this;

            if (!$('#content').hasClass('geteasy')) {
                viewFactory.loadTemplate(this.template, {
                    success: function(data, status) {
                        that.$el.html(data);
                        that.addEvents();
                    },
                    error: function(data, status) {
                        if (status == 404) {
                            that.$el.html(data);
                        }
                    }
                });
            } else {
                $(document).trigger('View.loaded');
                this.addEvents();
            }
        },

        addEvents: function() {
            $.get(window.base_url+'application/www/language/geteasy.xml', null, function (data, textStatus) {

                pleimo.Language = window.pleimo.Language || {};

                if (textStatus == "success")
                    _.extend(pleimo.Language, { geteasy : data });

            },'xml').done(function(){  pleimo.Geteasy.Init(); });
        }
    });

    return GetEasyView;
});