(function($){
    'use strict';
    var faq = function() {
        var $menu = $('.menu-topics');
        var $topics = $('.topics section');
        $menu.find('a').click(function(e) {
            $menu.find('li.active').removeClass('active');
            $(this).parent().addClass('active');

            $('.topics section').hide();

            var link = $(this).attr('href');
            $topics.siblings(link).fadeIn();
            $topics.find('article.active .accordion-content').hide();
            $topics.find('article.active').removeClass('active');
            e.preventDefault();
        });

        $topics.find('h3').click(function(e) {
            if ($(this).parent().hasClass('active')) {
                $(this).parent().find('.accordion-content').slideUp();
                $(this).parent().removeClass('active');
            } else {
                $topics.find('article.active .accordion-content').hide();
                $topics.find('article.active').removeClass('active');
                $(this).parent().find('.accordion-content').slideDown();
                $(this).parent().addClass('active');
            }
            e.preventDefault();
        });

        $menu.find('a:eq(0)').click();
    };

    $(document).ready(function() {
        faq();
    });
})(jQuery);