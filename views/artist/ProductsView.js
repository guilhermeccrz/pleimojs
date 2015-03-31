define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone'),
        ModalModel      = require('models/ui/ModalModel'),
        ModalView       = require('views/ui/ModalView'),
        ShareView       = require('views/ui/ShareView'),
        ProductsZoomView    = require('views/artist/ProductsZoomView'),
        ProductsCommentView = require('views/artist/ProductsCommentView'),
        ProductsPaymentView = require('views/artist/ProductsPaymentView'),
        ProductsRatingView  = require('views/artist/ProductsRatingView');

    var base_url = window.base_url;

    var ProductsView = ModalView.extend({
        initialize: function() {
            this.model = new ModalModel({
                className: '.modal.detail_product',
                content: ''
            });

            this.model.on('change:isOpen', this.beforeToggle, this);
            this.shareView = new ShareView();

        },

        events: {
            "click a.btn-close": "close"
        },

        render: function(product) {
            var that = this;
            $.ajax({
                type : "POST",
                data : {'product' : product},
                url  : base_url+"products/details"
            }).done(function(data){
                that.setContent(data);
                that.addEvents();
            });
        },
        addEvents: function() {

            this.productZoomView = new ProductsZoomView();
            this.productCommentsView = new ProductsCommentView();
            this.productPaymentView = new ProductsPaymentView();
            this.productRatingView = new ProductsRatingView();

            var that = this;
            that.shareView.render('product');

            /*LANGUAGE XML*/
            var language = window.language || {};

            $.get(base_url+'application/www/language/cart.xml', null, function (data, textStatus) {

                if (textStatus == "success") language = data;

            }, 'xml').done(function(){

                that.productZoomView.render();
                that.productCommentsView.render();
                that.productPaymentView.render();
                that.productRatingView.render();


                    /* ADD QUANTITY*/

                    $("a.icon.btn-minus").click(function(){
                        qty.Minus($('a.icon.btn-plus').parent().parent().find('input'));
                    });

                    $("a.icon.btn-plus").click(function(){
                        qty.Plus($('a.icon.btn-plus').parent().parent().find('input'));
                    });

                    $("#qty").keypress(function (e) {
                        if (e.which != 8 && e.which !== 0 && (e.which < 49 || e.which > 57)) {
                            return false;
                        }
                    });

                    var qty = {

                        "Plus" : function(field){
                            var val = parseInt(field.val());
                            val += 1;
                            field.val(val);
                        },

                        "Minus" : function(field){
                            var val = parseInt(field.val());
                            val -= 1;
                            if (val > 0){ field.val(val);}
                        }
                    };
            });
        },
        beforeToggle: function() {
            if (!this.model.get('isOpen')) {
                var artist = Backbone.history.location.pathname.split('/')[1];
                Backbone.history.navigate('/' + artist, { trigger: false } );
            }
            this.toggle();
        }

    });

   return ProductsView;
});