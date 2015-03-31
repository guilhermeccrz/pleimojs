// Filename: ShareView.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        ContentFactory  = require('views/ContentFactory'),
        Backbone        = require('backbone'),
        ShareModel      = require('models/ui/ShareModel');


    require('validate');
    require('validatePleimo');

    var base_url = window.base_url;

    var model = new ShareModel();
    model.setBasic();

    var viewFactory = new ContentFactory();

    var ShareView = Backbone.View.extend({

        //call Facebook ui
        shareFacebook: function(e,item,message,title){
            var FB = window.FB;
            FB.ui({
                method:      "feed",
                link:        base_url+item.permalink,
                name:        title,
                picture:     item.image,
                description: message
            });
        },

        //call ShareMailView
        shareEmail: function(type,target){
            viewFactory.getView('modals/ShareMailView', function(view){
                view.render(type,target);
            });
        },

        //get element attributes
        getAttribute: function($el){
            var item = {
                permalink : $el.data('permalink'),
                artist : $el.data('artist'),
                song : $el.data('song'),
                album : $el.data('album'),
                image : $el.data('image'),
                playlist : $el.data('playlist'),
                video : $el.data('video'),
                product : $el.data('product')
            };

            return item;
        },

        //define events
        addEvents:function(item,message){
            var self = this;

            var type        = 'noType',
                iSong       = item.song,
                iArtist     = item.artist,
                iPermalink  = item.permalink,
                iProduct    = item.product;

            //define video type to get correct message to set into model
            if(iSong.length > 0){type = 'song';}
           // else if(iProduct.length > 0){type = 'product';}
            else if (iSong.length === 0 && iProduct === 'undefined' && iArtist.length > 0 && iPermalink.indexOf('video') === -1){ type = 'artist';}
            else if (iPermalink.indexOf('video') != -1){ type = 'video';}
            else if (iProduct !== 'undefined'){ type = 'product';}

            //console.log(type);

            //clicks & overs & popUps and changing model attrs
            $('a.share').mouseleave(function(){
                $(this).find('.popover').hide();
            });

            $('li a.twitter').off().on('mouseenter',function(){
                model.set({type:type, name:item.artist, socialVehicle:'twitter', song:item.song, product:item.product});
                $(this).attr("href","http://twitter.com/intent/tweet/?via=Pleimo&text="+self.getMessage()+base_url+item.permalink);
            });

            $('.plus').off().on('mouseenter',function(){
                model.set({type:type, name:item.artist, socialVehicle:'twitter', song:item.song, product:item.product});
                $(this).attr("href","http://plus.google.com/share?url="+base_url+item.permalink);
            });

            $("li.facebook a.facebook").off().on("click",function(e){
                model.set({type:type, name:item.artist , socialVehicle: 'facebook', song:item.song, product:item.product});
                self.shareFacebook(e,item,self.getMessage(),self.getTitle());
            });

            $(".social li a.mail").off().on("click",function(e){
                var dataType = $(this).data('type');
                var dataTarget = $(this).data('target');
                self.shareEmail(dataType,dataTarget);
            });

            $(".social li a.popup").off('click').on("click",function(e){
                var width = 640,
                    height = 480,
                    left = ($(window).width() - width) / 2,
                    top = ($(window).height() - height) / 2,
                    url = this.href,
                    opts = 'status=1' +
                        ',width=' + width +
                        ',height=' + height +
                        ',top=' + top +
                        ',left=' + left;

                window.open(url, 'Pleimo (beta) - #pttp', opts);
                return false;
            });
        },

        getMessage: function(){
            return model.get('message');
        },

        getTitle: function(){
            return model.get('title');
        },

        //setting & returning html template to popOver
        setTemplate: function(item){

            var template = '<ul class="social">'+
                '<li class="facebook"><a href="javascript:void(0);" class="facebook"></a></li>'+
                '<li><a class="twitter popup" href="#"></a></li>'+
                '<li><a class="plus popup" href="#"></a></li>'+
                '<li><a class="mail" data-target="'+base_url+item.permalink+'" data-type="artist" href="javascript:void(0);"></a></li>'+
                '</ul>';

            return template;
        },

        render: function(type) {
            var self = this;

            if(type == 'product'){

                var $el = $('.product-image .share');
                self.addEvents(self.getAttribute($el));

            }
            else{
                //event to start share popover
                $(document).on("click", "[data-popover=share]", function(e) {

                    $(".popover").remove();
                    var $el = $(e.target);

                    $el.popover({
                        selector: $el,
                        html: true,
                        trigger: 'manual',
                        placement: $el.parent().data('placement'),
                        content: self.setTemplate(self.getAttribute($el))
                    });

                   $el.popover("show");
                   e.preventDefault();
                   self.addEvents(self.getAttribute($el));
                });
            }

        }
    });

    return ShareView;
});