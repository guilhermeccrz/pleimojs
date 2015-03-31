define(function(require){
    "use strict";

    var Backbone = require('backbone'),
        base_url = window.base_url,
        language = window.language || {};



    var ShareModel = Backbone.Model.extend({

        defaults: {
            type: "not specified",
            name: "not specified",
            title: "not specified",
            message: "msg not specified",
            socialVehicle: "not specified",
            song: "not specified",
            product: "not specified"
        },

        //setting basic call to get language data
        setBasic: function(){

            $.get(base_url+'application/www/language/share.xml', null, function (data, textStatus) {
                if (textStatus == "success") language = data;
            }, 'xml');

        },

        initialize: function(){

            //bind change and return final message
            this.bind("change", function(){
                this.returnMessage();
            });

        },

        //selecting the right message to return
        returnMessage: function(){
            var lang                = window.lang,
                selfReturnMessage   = this,
                social              = this.get('socialVehicle'),
                type                = this.get('type');


            var message = $(language).find('data text[id="share-'+social+'-text-'+type+'"] '+lang).text(),
                title =  $(language).find('data text[id="share-'+social+'-subject-'+type+'"] '+lang).text();

            if(type == 'song'){
                var messageRes = message.replace("[[SONG]]", selfReturnMessage.get('song'));
                message = messageRes.replace("[[ARTIST]]", selfReturnMessage.get('name'));
            }

            if(type == 'product'){
                var messageProd = message.replace("[[PRODUCT]]", selfReturnMessage.get('product'));
                var messageArt = messageProd.replace("[[ARTIST]]", selfReturnMessage.get('name'));
                message = messageArt.replace("[[LINK]]", "");
            }

            else {
                message = message.split('[['); var messageEnd = message[1].split(']]');
                message = message[0] + selfReturnMessage.get('name') + messageEnd[1];
            }

            selfReturnMessage.set('message',message);

            if(title){
                title = title.split('[['); var titleEnd = title[1].split(']]');
                title = title[0] + selfReturnMessage.get('name') + titleEnd[1];
                selfReturnMessage.set('title',title);
            }

        }

    });

    return ShareModel;
});