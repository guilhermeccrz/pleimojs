define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone');

    var base_url = window.base_url;

    var ProductsCommentView = Backbone.View.extend({
        el: $('#comments'),
        render: function() {

            $('#comment-tab.empty a').click(function(){
                $('a[href=#rating-tab]').trigger('click');
            });

            //LETTERS COUNT
            $('#comments').keyup(function(){
                var max = 140;
                var len = $(this).val().length;

                if (len >= max) {
                    $('#comments-count').text('Nenhum caracter restante.');
                } else {
                    var char = max - len;
                    $('#comments-count').text(char + ' caracteres restantes.');
                }
            });

            //SEND RATE ACTION
            $("a.button.btn-rate").click(function(){
                send.Rate();
            });

            var commentTab = {

                _initialized: false,

                init: function() {

                    if (!this._initialized) {

                        this._initialized = true;

                        $('#comment-tab ul').carouFredSel({
                            width: '718px',
                            scroll: 1,
                            prev: '#comment-prev',
                            next: '#comment-next',
                            auto: false,
                            items: {
                                visible: {
                                    min: 3
                                }
                            },
                            infinite: false,
                            circular: false
                        });
                    }
                }
            };

            var send = {

                "Rate" : function(){

                    $.ajax({
                        type : "POST",
                        data : ({'rate' : $('#rate').val(), 'comment' : $('#comments').val(), 'artist_product' : $('#artist_product').val()}),
                        url  : base_url+"products/rate"
                    }).done(function(data, status, response){

                        if (response.status == 200)
                        {
                            data = $.parseJSON(data);

                            var total_rates = parseFloat($('#total_rates').val());
                            var total_users = parseInt($('#total_users').val());
                            if (data.comment !== ''){
                                if ($('section#comment-tab ul li:first div').length > 0 && $('section#comment-tab ul li:first div').length == 1){
                                    $('section#comment-tab ul li:first').append('<div class="depoimento"><p class="autor"><strong>'+data.name+' '+data.lastname+'</strong><span class="rating-stars rating-'+data.rate+'"><i class="star-1"></i><i class="star-2"></i><i class="star-3"></i><i class="star-4"></i><i class="star-5"></i></span></p><p>'+data.comment+'</p></div>');
                                }
                                else{
                                    $('section#comment-tab ul li:first').before('<li><div class="depoimento"><p class="autor"><strong>'+data.name+' '+data.lastname+'</strong><span class="rating-stars rating-'+data.rate+'"><i class="star-1"></i><i class="star-2"></i><i class="star-3"></i><i class="star-4"></i><i class="star-5"></i></span></p><p>'+data.comment+'</p></div></li>');
                                }
                                if ($('section#comment-tab').hasClass('empty')){
                                    $('section#comment-tab').removeClass('empty');
                                    $('section#comment-tab').find('span').remove();
                                    $('section#comment-tab ul').append('<li><div class="depoimento"><p class="autor"><strong>'+data.name+' '+data.lastname+'</strong><span class="rating-stars rating-'+data.rate+'"><i class="star-1"></i><i class="star-2"></i><i class="star-3"></i><i class="star-4"></i><i class="star-5"></i></span></p><p>'+data.comment+'</p></div></li>');
                                    $('section#comment-tab div').css('overflow', 'visible');
                                }
                            }

                            total_rates += parseInt(data.rate);
                            total_users += 1;

                            var rate_avg = Math.ceil((total_rates/total_users));
                            $('p.rating').find('span').removeClass().addClass('rating-stars rating-'+rate_avg);
                            if (data.comment !== '') $('a[href=#comment-tab]').trigger('click');

                            if ($('#comment-tab ul li').length > 3)
                            {
                                commentTab._initialized = false;
                                commentTab.init();
                            }

                            $('#comments').val('');
                            $('#rate').val(5);
                            $('#total_rates').val(total_rates);
                            $('#total_users').val(total_users);
                            $('section#rating-tab span.rating-stars').removeClass().addClass('rating-stars clickable rating-5');
                        }
                    });
                }
            };
        }
    });

    return ProductsCommentView;
});
