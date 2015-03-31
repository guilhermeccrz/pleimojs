$(function () {

    $.get(base_url+'application/www/language/cart.xml', null, function (data, textStatus) {

        if (textStatus == "success") language = data;

    }, 'xml').done(function(){




        var closeMask = function() {

            $("#mask").hide();
            $(document).scrollTop(scroll);

            scroll = null;
            errors = false;

            if ($('.zoomContainer').length > 0) {
                $('.zoomContainer').remove(); // remove zoom container from DOM
            }

            $(".blackbox, .outbox").remove();

        };

        $("a.button.btn-cart").one("click", function(){
            send.Purchase($(this));
        });

        $(document).on('click', "a.button.btn-gray", function(e){
            closeMask();

            console.log('close mask');
            e.stopImmediatePropagation();
        });

        $('.nav-tabs li a').click(function(){
           $('.tab-content section').hide();
            $('.tab-content section').removeClass('active');
            $('.tab-content '+$(this).attr('href')).show();
            $('.tab-content '+$(this).attr('href')).addClass('active');

        });

        $("a.button.btn-rate").click(function(){
            send.Rate();
        });

        $("a.icon.btn-minus").click(function(){
            qty.Minus($('a.icon.btn-plus').parent().parent().find('input'));
        });

        $("a.icon.btn-plus").click(function(){
            qty.Plus($('a.icon.btn-plus').parent().parent().find('input'));
        });

        $('#comment-tab.empty a').click(function(){
            $('a[href=#rating-tab]').trigger('click');
        });

        $("#qty").keypress(function (e) {
            if ((e.which != 8) && (e.which !== 0) && (e.which < 49 || e.which > 57)) {
                return false;
            }
        });

        $("li.facebook a.facebook").click(function(){
           share.facebook();
        });

        $(document).on("click", "a.btn-close", function(){
            closeMask();

            $.removeData($("#product-image"), 'elevateZoom');//remove zoom instance from image
            $('.zoomContainer').remove();// remove zoom container from DOM

            $('modal detail-product outbox container_18').remove();
        });

        $('#comments').keyup(function () {
            var max = 140;
            var len = $(this).val().length;

            if (len >= max) {
                $('#comments-count').text('Nenhum caracter restante.');
            } else {
                var char = max - len;
                $('#comments-count').text(char + ' caracteres restantes.');
            }
        });


        $('#payment-tab input[type=radio]').click(function() {
            $('.pagto').hide();
            if  ( ($(this).val() == "visa") || ($(this).val() == "master") ) {
                $('.pagto.cartao').show();
            } else if ($(this).val() == "boleto") {
                $('.pagto.boleto').show();
            } else {
                $('.pagto.paypal').show();
            }
        });

        var checked_payment = $(".payment-type input:checked").val();

        if (checked_payment != "paypal" && checked_payment != "boleto")
        {
            checked_payment = 'cartao';
        }

        $('.pagto.'+checked_payment).show();

        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            if ( $(e.target).attr('href') == '#comment-tab' ) {
                commentTab.init();
            }
        });

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

    var checkRating = function($this) {
        var classNames = $this.get(0).className.split(/\s+/);
        for (var i=0; i<classNames.length; ++i) {
            if (classNames[i].substr(0, 5) === "rating-") {
                return classNames[i];
            }
        }
        return 'rating-0';
    };

    var send = {

        "Purchase" : function(object){

            $.ajax({
                type : "POST",
                data : ({'artist_product' : $('#artist_product').val(),
                    'product'        : $('#product').val(),
                    'artist'         : $('#artist').val(),
                    'thumbnails'     : $('#thumbnails').val(),
                    'name'           : $('#name').val() + ": " +$('#artist_name').val(),
                    'description'    : $('#description').val(),
                    'price'          : $('#price').val(),
                    'quantity'       : $('#qty').val(),
                    'weight'         : $('#weight').val(),
                    'recurrent'      : $('#recurrent').val(),
                    'size'           : $('input[name=size]:checked').val(),
                    'pay_method'     : $('input[name=forma]:checked').val()}),
                url  : base_url+"cart/add"
            }).done(function(data, status, response){
                if (response.status == 200)
                {
                    $('.outbox').remove();
                    if ($('.zoomContainer').length > 0)
                    {
                        $('.zoomContainer').remove();// remove zoom container from DOM
                    }
                    $.get(base_url+'products/added', {}, function(data){
                        $('body').append(data);
                    });
                }
            });

        },

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
                            $('section#comment-tab div').css('overflow', 'visible')
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

    var qty = {

        "Plus" : function(field){
            var val = parseInt(field.val());
            val += 1;
            field.val(val);
        },

        "Minus" : function(field){
            var val = parseInt(field.val());
            val -= 1;
            if (val > 0)
            {
                field.val(val);
            }
        }
    };

});