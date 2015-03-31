define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone');

    var ProductsRatingView = Backbone.View.extend({
        el: $("#product-image"),
        render: function() {

            var classDefault = 'rating-0';

            $('.rating-stars.clickable a').hover(function() {
                var $this = $(this);
                var $parent = $this.parent();

                classDefault = ($parent.hasClass('clicked')) ? checkRating($parent) : classDefault;

                $parent.removeClass('rating-0 rating-1 rating-2 rating-3 rating-4 rating-5');

                var classNames = $this.get(0).className.split(/\s+/);
                for (var i=0; i<classNames.length; ++i) {
                    if (classNames[i].substr(0, 5) === "star-") {
                        var num = classNames[i].substr(5, 1);
                        $parent.addClass('rating-' + num);
                    }
                }
            }, function() {
                var $this = $(this);
                var $parent = $this.parent();

                $parent.removeClass('rating-0 rating-1 rating-2 rating-3 rating-4 rating-5');
                $parent.addClass(classDefault);
            });

            $('.rating-stars.clickable a').click(function() {
                var $this = $(this);
                var $parent = $this.parent();

                $parent.removeClass('rating-0 rating-1 rating-2 rating-3 rating-4 rating-5');

                var classNames = $this.get(0).className.split(/\s+/);
                for (var i=0; i<classNames.length; ++i) {
                    if (classNames[i].substr(0, 5) === "star-") {
                        var num = classNames[i].substr(5, 1);
                        $parent.addClass('rating-' + num);
                        classDefault = 'rating-' + num;
                        $('#rate').val(num);
                    }
                }
            });

            var checkRating = function($this) {
                var classNames = $this.get(0).className.split(/\s+/);
                for (var i=0; i<classNames.length; ++i) {
                    if (classNames[i].substr(0, 5) === "rating-") {
                        return classNames[i];
                    }
                }
                return 'rating-0';
            };

        }



    });


    return ProductsRatingView;
});
