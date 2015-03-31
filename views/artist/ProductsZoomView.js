define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone');
        require('elevateZoom');

    var ProductsZoomView = Backbone.View.extend({
        el: $("#product-image"),
        render: function() {

            $("#product-image").elevateZoom({
                'zoomWindowWidth': 303,
                'zoomWindowHeight' : 385,
                'borderSize' : 1,
                'borderColour' : '#e6e6e6',
                'lensBorderColour' : '#c6c6c6',
                'zoomWindowOffetx' : 55,
                'zoomWindowFadeIn' : true,
                'zoomWindowFadeOut' : true
            });

        }

    });

    return ProductsZoomView;
});
