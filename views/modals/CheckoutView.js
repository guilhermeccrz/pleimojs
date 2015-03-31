// CheckoutView.js
define(function(require){
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        ModalModel = require('models/ui/ModalModel'),
        ModalView = require('views/ui/ModalView'),
        ContentFactory = require('views/ContentFactory'),
        GA = require('gga');
    var viewFactory = new ContentFactory();
    var lang = window.lang;
    var base_url = window.base_url;
    var pleimo = window.pleimo || {};
    var subscribeType;
    /**
     * @author Leonardo Moreira <developer@pleimo.com>
     * @type {{Open: Function}}
     */
    pleimo.Checkout = {
        "Init" : function()
        {
            $(".subscription-payment .submit").click(function(){
                $(this).addClass('wait').val(null);
                pleimo.Checkout.Submit();
            });
            if (pleimo.Geteasy && pleimo.Geteasy.planType) {
                $('.plans').data("type", "streamer");
                if (pleimo.Geteasy.planType == pleimo.Geteasy.TYPE.ARTIST) {
                    $('.plans a[href=#artists]').tab('show');
                    $('.plans').data("type", "artist");
                }
                $('.plans').on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
                    $('.plans').data("type", $(e.target).data("utype"));
                    GA.trackEvent('geteasy:tab['+$(e.target).data("utype")+']', 'click', { 'page': 'geteasy/checkout' });
                });
            }
        },
        "ShowCoupon" : function()
        {
            $(".subscription-payment .coupon").show();
        },
        Submit: function() {
            var that = this;
            if ($(".subscription-payment").find('.alert-warning').length > 0) {
                pleimo.Checkout.button();
                return false;
            }
            if (pleimo.Geteasy && pleimo.Geteasy.planType) {
                $.ajax({
                    "type" : "POST",
                    "url" : window.base_url+"geteasy/send-data",
                    "dataType": "json",
                    "data":
                    {
                        "type" : $('.plans').data("type")
                    },
                    success : function(data)
                    {
                        if (0 === data.success) {
                            GA.pageView('geteasy/invalid');
                            viewFactory.getView('modals/GetEasyVoucherView');
                            setTimeout(function() {
                                var text = $(pleimo.Language.geteasy).find('data text[id="geteasy-voucher-submit-button"] '+lang).text();
                                $("#voucher-submit")
                                    .removeClass('wait')
                                    .html(text);
                            }, 1000);
                            return;
                        }
                        that.process();
                    }
                });
                return;
            }
            that.process();
        },
        "process" : function ()
        {
            if(subscribeType == 'offSubscription'){
                GA.pageView('checkout/process');
                $.ajax({
                    type : "POST",
                    url : window.base_url+"checkout/process",
                    dataType: "json",
                    success : function(data)
                    {
                        if (data.ACK === "Success")
                            return window.top.location = data.REDIRECT + data.TOKEN;
                        pleimo.Checkout.button();
                    }
                });
            }
            else{
                GA.pageView('checkout/process');
                $.ajax({
                    type : "POST",
                    url : window.base_url+"checkout/process",
                    dataType: "json",
                    success : function(data)
                    {
                        if (data.ACK === "Success")
                            return window.top.location = data.REDIRECT + data.TOKEN;
                        pleimo.Checkout.button();
                    }
                });
            }
        },
        "button" : function ()
        {
            var text = $(pleimo.Language.Checkout).find('data text[id="checkout-button-go-paypal"] '+lang).text();
            $(".subscription-payment .submit")
                .removeClass('wait')
                .val(text);
        }
    };
    /**
     * @namespace
     * @alias pleimo.coupon
     */
    pleimo.Checkout.Coupon = {
        /**
         * @author Leonardo Moreira <developer@pleimo.com>
         * @method
         * @alias pleimo.Checkout.Coupon.Push
         */
        "Pull" : function() {
            $.ajax({
                type : "POST",
                data : { "coupon" : $("#coupon-hash").val() },
                url : window.base_url+"coupon/get",
                beforeSend : function() {
                    $(".subscription-payment .coupon .alert").remove();
                    $(".subscription-payment .coupon .coupon-check").addClass('wait').val(null);
                },
                success : function(data){
                    if(!data){
                        $(".subscription-payment .coupon .coupon-check").removeClass('wait').val($(pleimo.Language.Coupon).find('data text[id="coupon-save"] '+lang).text());
                        return false;
                    }
                    data = $.parseJSON(data);
                    var coupon = data.coupon;
                    if (data.message) {
                        pleimo.Checkout.Coupon.Error(data);
                    }
                    if ( ! data.message) {
                        pleimo.Checkout.Coupon.Push(coupon);
                    }
                }
            });
        },
        /**
         * @author Leonardo Moreira <developer@pleimo.com>
         * @method
         * @alias pleimo.Checkout.Coupon.Push
         */
        "Push" : function(data) {
            var $price = (pleimo.Subscribe.PRICE - data.PRICE).toFixed(2);
            if ($price < 0)
                $price = (0.00).toFixed(2);
            $(".subscription-payment .offer b").html($price);
            $(".subscription-payment .coupon .coupon-check").remove();
        },
        /**
         * @author Leonardo Moreira <developer@pleimo.com>
         * @method
         * @alias pleimo.coupon.Error
         */
        "Error" : function(data) {
            var text = $(pleimo.Language.Coupon).find('data text[id="coupon-save"] '+lang).text();
            $(".subscription-payment .coupon .coupon-check").removeClass('wait').val(text);
            $(".subscription-payment .coupon .pagto p").append("<div class=\"alert alert-warning\"><span>"+data.message+"</span></div>");
        }
    };
    window.pleimo = pleimo;
    var CheckoutView = ModalView.extend({
        initialize: function() {
            this.model = new ModalModel({
                className: '.modal.subscription-payment.outbox',
                content: ''
            });
            this.model.on('change:isOpen', this.toggle, this);
        },
        events: {
            "click a.btn-close": "closeAndRestore"
        },
        closeAndRestore: function(e){
            if(pleimo.Geteasy && pleimo.Geteasy.Voucher){
                $.get(base_url+'application/www/language/geteasy.xml',{}, function (data, textStatus){
                },'xml').done(function(){
                    $("#voucher-submit").removeClass('wait').html($(pleimo.Language.geteasy).find('data text[id="geteasy-voucher-submit-button"] '+lang).text());
                });
            }
            return;
        },
        render: function(type) {
            var that = this;
            var url = (type == "geteasy") ? 'geteasy/payment_modal' : (type == "plans") ? 'checkout/plans' : 'checkout';
            if(type === 'offSubscription' ){
                subscribeType = type;
                GA.pageView('checkout/plans');
                $.ajax({
                    type: "POST",
                    url: window.base_url + 'checkout/plans',
                    data: {}
                }).done(function(data) {
                    $('.modal').hide();
                    that.setContent( data);
                    that.addEvents();
                    that.selectPlanType();
                });
                return this;
            }else{
                GA.pageView(url);
                $.ajax({
                    type: "POST",
                    url: window.base_url + url,
                    data: {subscribe: pleimo.Subscribe }
                }).done(function(data) {
                    $('.modal').hide();
                    that.setContent( data);
                    that.addEvents();
                });
                return this;
            }
        },
        subscribePlan: function(plan){
            GA.pageView("plans/subscribe/" + plan);
            $.ajax({
                type: "POST",
                url: base_url + "plans/subscribe/" + plan
            }).done(function(data) { });
        },
        selectPlanType: function(){
            var selfPlan = this;
            pleimo.Subscribe = 'streamer';
            selfPlan.subscribePlan('freemium');
            $('.plans-type').on('click', function(){
                var utype = $(this).data('utype');
                pleimo.Subscribe = utype;
                selfPlan.subscribePlan(pleimo.Subscribe);
            });
        },
        addEvents: function() {
            pleimo.Language = window.pleimo.Language || {};
            $.get(window.base_url+'application/www/language/checkout.xml', null, function (data, textStatus) {
                if (textStatus == "success") _.extend(pleimo.Language, { Checkout : data });
            }, 'xml').done(function(){
                pleimo.Checkout.Init();
                $(".subscription-payment .open-coupon").click(function(){
                    pleimo.Checkout.ShowCoupon();
                });
            });
            $.get(window.base_url+'application/www/language/coupon.xml', null, function (data, textStatus) {
                if (textStatus == "success") _.extend(pleimo.Language, { Coupon : data });
            }, 'xml').done(function(){
                $(".subscription-payment .coupon-check").off('.checkout').on('click.checkout', function(){
                    pleimo.Checkout.Coupon.Pull();
                });
            });
        }
    });
    return CheckoutView;
});