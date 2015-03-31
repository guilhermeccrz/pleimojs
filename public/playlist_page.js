$(function () {

    var tab    = null;
    var hash   = (location.pathname).split("/");

    $.get(base_url+'application/www/language/playlists.xml', null, function (data, textStatus) {
        
        if (textStatus == "success") language = data;     

    }, 'xml').done(function(){ 

        if ($("#albums-carousel").find("li").length > 0) slider.albums();
        
        $(".music-rating").jRating({
            rateInfosY : -35,
            rateMax : 5,
            step: true,
            canRateAgain: true,
            phpPath : base_url+'musics/rate',
            smallStarsPath: assets_url+'images/icon-fav-star.png'
        });
        
        $(".select-album").on("click", function(e) {
            
            $(".music-list").hide();
            $(".albums-nav li").removeClass("active");

            $(this).parent().parent().addClass("active");
            $("[data-id="+$(this).data("id")+"]").show();

            History.pushState(null, null, base_url+hash[1]+"/"+hash[2]+"/"+$(this).data("id"));
            e.preventDefault();

        });
        
    });
    
    var slider = {
  
        'albums' : function() {
 
            $('#albums-carousel').carouFredSel({
                width: '100%',
                scroll: 1,
                prev: '#album-prev',
                next: '#album-next',
                auto: false,
                align: 'left',
                items: {
                    visible: {
                        min: 7
                    }
                }
            });
        
        }
        
    };
    
});