var limit        = 20;
var musics_page  = 0;
var albums_page  = 0;
var videos_page  = 0;
var offset       = 0;
var artists_page = 0;

$(function () {

    $("#tabs li a, #tabs-item").click(function() {

        var tab = $(this).data("tab");
            
        $("#tabs li").removeClass('active');
        $("."+tab).parent().addClass("active");
 
        $(".tab").hide();

        $("#"+tab).fadeIn("fast");
        $(document).scrollTop(0);
        
        return false;
        
    });

    $(document).on("click", "li.music-item a.heart", function(e){
        if ($(this).hasClass('favorite')){
            $('li.music-item').find('[data-target='+$(this).data('target')+']').removeClass('favorite').addClass('unfavorite active');
        }else{
            $('li.music-item').find('[data-target='+$(this).data('target')+']').removeClass('unfavorite active').addClass('favorite');
        }
        e.stopImmediatePropagation();
    });

    $(document).on("click", "section.videos-list ul li", function(e){
        show.video($(this), e);
    });

    $(document).ready(function(){
        show.rate();
    });

    $(document).on("click", ".load-more-search", function(e){
        type = $(this).data('type');
        $(this).removeClass('load-more-search').addClass('loading-more-'+type);
        show.more(type);
        e.stopImmediatePropagation();
    });

    /**
     * Object to contain functions of exhibition
     * of the results.
     *
     * @author Renato Biancalana da Silva <r.silva@pleimo.com>
     * @type {{video: function}}
     * @type {{more : function}}
     * @type {{rate : function}}
     */
    var show = {

        "video" : function(element, event){
            event.preventDefault();
            openMask();
            $.get(base_url+'application/www/views/search/yt-player.php', { "API_ID" : $(element).data('apiid') }, function( data ) {
                $("body").append(data);
            });
        },

        "more" : function(type){
            switch (type)
            {
                case 'musics' :
                    musics_page++;
                    offset = musics_page * limit;
                    break;
                case 'albums' :
                    albums_page++;
                    offset = albums_page * limit;
                    break;
                case 'videos' :
                    videos_page++;
                    offset = videos_page * limit;
                    break;
                case 'artists' :
                    artists_page++;
                    offset = artists_page * limit;
                    break;
            }

            $.ajax({
                type     : "POST",
                url      : base_url+'search/more/'+type+'/'+limit+'/'+offset
            }).done(function(data){
                data = $.parseJSON(data);
                $(data.view).each(function(i, val){
                    if (i % 2 == 0)
                    {
                        $('.loading-more-'+type).before(val);
                        var totalContent = $('section#'+type+'-tab ul li').length;
                        if (totalContent % 5 == 0 && type != 'musics') $('section#'+type+'-tab ul li:last').addClass('last');
                    }
                })

                if (type == 'musics') show.rate();
                if ($('section#'+type+'-tab ul li').length < data.total){
                    $('.loading-more-'+type).removeClass('loading-more-'+type).addClass('load-more-search');
                }else{
                    $('.loading-more-'+type).hide();
                }
            });
        },

        "rate" : function(){
            $(".music-rating").jRating({
                rateInfosY : -35,
                rateMax : 5,
                step: true,
                isDisabled: true,
                smallStarsPath: assets_url+'images/icon-fav-star-silver.png'
            });
        }

    }

});