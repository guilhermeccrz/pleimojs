$(function () {

    var req      = null;
    var page     = 1;
    var limit    = 12;
    var offset   = 0;
    var total    = false;
    var $content = $("#grid");
    var $container = document.querySelector('#grid');
    var $tmpl    = $.get(base_url+'application/www/views/artists/box.tpl');
    var $boxtmp  = $.get(base_url+'application/www/views/artists/box-loading.tpl');

    $.get(base_url+'application/www/language/artists.xml', null, function (data, textStatus) {
        
        if (textStatus == "success") language = data;     

    }, 'xml').done(function(){ 
        
        load.append(null);
        
        $(document).bind('scroll', function()
        {
            if($(window).scrollTop() + $(window).height() >= $(document).height()-$(".footer-nav").height() && req === null
                && window.location.pathname == "/artists")
            {
                if (page >= 3) 
                    return false;

                load.page(limit, offset);
            }
        });
        
        $(document).on('click', '.load-more', function() {
            $(this).remove();
            load.page(limit, offset);
        });

    });
    
    var load = {

        "page" : function(limit, offset) {
            
            if (req !== null) req.abort();
            
            offset = page * limit;

            var elems = [];
            for(var i=0; i<=4; i++) {
                elems.push(i);
            }
            
            elems = $.tmpl($boxtmp.responseText, elems);
            load.append(elems);
            
            req = $.ajax({
                type: "POST",
                url: base_url+"releases/page/"+limit+"/"+offset,
                data: { }
            }).done(function( data ) {
                
                data = $.parseJSON(data);
                page++;
                
                $content.find(".loading").remove();
                
                if ( ! data.length) {
                    total = true;
                    return false;
                }

                elems = $.tmpl($tmpl.responseText, data);
                load.append(elems);
                
                if (page >= 3) 
                    $content.after("<span class=\"load-more grid_3 push_6\"></span>");

                req = null;

            });

        },
        
        "append" : function(elems) {
            
            var $msnry   = new Masonry($container, { itemSelector: '.box', transitionDuration : '0.2s' });

            $content.append(elems);         
            $content.imagesLoaded(function() {

                $msnry.appended(elems);
                $msnry.layout();

            });

        }
        
    };

});