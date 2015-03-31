define(function(require){

    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone'),
        ContentFactory  = require('views/ContentFactory');


    var viewFactory = new ContentFactory();

    var FaqView = Backbone.View.extend({
        el: '#main',
        template: '/faq',
        render: function() {
            var that = this;

            if (!$('#content').hasClass('faq')) {
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
            var faq = function() {
                var $menu = $('.menu-topics');
                var $topics = $('.topics section');

                $menu.find('a').click(function(e) {
                    $menu.find('li.active').removeClass('active');
                    $(this).parent().addClass('active');

                    $('.topics section').hide();

                    var link = $(this).attr('href');
                    $topics.siblings(link).fadeIn();

                    var $topic_active = $topics.find('article.active');
                    $topic_active.find('.accordion-content').hide();
                    $topic_active.removeClass('active');

                    e.preventDefault();
                });

                $topics.find('h3').click(function(e) {
                    var $parent = $(this).parent();
                    if ($parent.hasClass('active')) {
                        $parent.find('.accordion-content').slideUp();
                        $parent.removeClass('active');

                    } else {
                        var $topic_active = $topics.find('article.active');
                        $topic_active.find('.accordion-content').slideUp();
                        $topic_active.removeClass('active');
                        $parent.find('.accordion-content').slideDown();
                        $parent.addClass('active');
                    }
                    e.preventDefault();
                });

                $menu.find('a:eq(0)').click();
            };

            $(document).ready(function() {
                faq();
            });
        }

    });

    return FaqView;
});