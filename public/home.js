define([
    'jquery',
    'viewportSize'
],
function($){
    /*! viewportSize | Author: Tyson Matanich, 2013 | License: MIT */
    //(function(n){n.viewportSize={},n.viewportSize.getHeight=function(){return t("Height")},n.viewportSize.getWidth=function(){return t("Width")};var t=function(t){var f,o=t.toLowerCase(),e=n.document,i=e.documentElement,r,u;return n["inner"+t]===undefined?f=i["client"+t]:n["inner"+t]!=i["client"+t]?(r=e.createElement("body"),r.id="vpw-test-b",r.style.cssText="overflow:scroll",u=e.createElement("div"),u.id="vpw-test-d",u.style.cssText="position:absolute;top:-1000px",u.innerHTML="<style>@media("+o+":"+i["client"+t]+"px){body#vpw-test-b div#vpw-test-d{"+o+":7px!important}}<\/style>",r.appendChild(u),i.insertBefore(r,e.head),f=u["offset"+t]==7?i["client"+t]:n["inner"+t],i.removeChild(r)):f=n["inner"+t],f}})(this);

    $(function () {

        var pleimo     = window.pleimo || {};
        var $content   = $("#grid");
        var $container = document.querySelector('#grid');
        var $tmpl      = $.get(base_url+'application/www/views/artists/box.tpl');

        $.get(base_url+'application/www/language/artists.xml', null, function (data, textStatus) {

            if (textStatus == "success") language = data;

        }, 'xml').done(function(){

            $content.find('.box').css({opacity:0});

            $content.imagesLoaded(function(){
                $content.find('.box').animate({ opacity: 1});
                load.append(null);
            });

            if (firstLogin)
                pleimo.Template.Support();

            if (typeof pleimo.Options.support_artist === 'undefined' && ! firstLogin)
                pleimo.Template.Support();

            if (typeof pleimo.Options.chose_genders === 'undefined' && typeof pleimo.Options.support_artist !== 'undefined' && ! firstLogin)
                pleimo.Template.Genders();

            $(document).bind('scroll', function()
            {
                if($(window).scrollTop() + viewportSize.getHeight() >= ($(document).height() * 70/100) && (load.req === null) && (window.location.pathname == "/" || window.location.pathname == "/home"))
                {
                    if (load.pageNum >= 3)
                        return false;

                    load.page(load.limit, load.offset);
                }
            });

            $(document).on('click', '.load-more span', function() {
                $('.load-more').remove();
                load.page(load.limit, load.offset);
            });

        });

        var load = {
            pageNum : 1,
            limit: 24,
            offset: 0,
            req: null,

            "page" : function(limit, offset) {

                if (this.req !== null) this.req.abort();

                this.offset = this.pageNum * this.limit;

                $content.after('<div class="loading"></div>');

                this.pageNum++;

                this.req = $.ajax({
                    type: "POST",
                    url: base_url+"home/page/"+this.limit+"/"+this.offset
                }).done(function( data ) {

                    data = $.parseJSON(data);

                    $content.parent().find(".loading").remove();

                    var elems = $.tmpl($tmpl.responseText, data);

                    $(elems).css({opacity: 0});

                    load.append(elems);

                    if (load.pageNum >= 3)
                        $content.after('<div class="load-more"><span></span></div>');

                    load.req = null;
                });

            },

            "append" : function(elems) {
                if (pleimo.Layout) {
                    $msnry = pleimo.Layout.initMsnry('.artist-box');
                    $msnry.stamp(document.querySelector('.top10'));
                    //this.msnry = $msnry;

                    $(elems).css({opacity:0});

                    $content.append(elems);
                    $content.imagesLoaded(function() {

                        $(elems).animate({ opacity: 1});
                        $msnry.appended(elems);

                        $('.full-list').height($('#grid').height() + 100);

                        $(window).trigger('resize');
                    });

                    $(window).trigger('resize');
                } else {
                    $(document).on('layoutloaded', function() {
                        pleimo.Home.append(elems);
                        $(document).off('layoutloaded');
                    });
                }
            }
        };

        $('.box.masonry').parent().bind( 'transitionend', function() {
            $('.box.masonry').removeClass('masonry');
        });

        pleimo.home = load;
        window.pleimo = pleimo;


    });
});