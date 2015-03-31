define(function(require){
    "use strict";

    var Backbone        = require('backbone');

    var ItemModel = Backbone.Model.extend({
        defaults: {
            "type": "",
            "artist": {
                "name": "",
                "link": "",
                "permalink": ""
            },
            "song": {
                "id": "",
                "token": "",
                "name": "",
                "album": "",
                "favs": "",
                "permalink": "",
                "image": ""
            },
            "video": {
                "id": "",
                "description": "",
                "title": "",
                "favs": "",
                "image": ""
            },
            "product": {
                "id": "",
                "token": "",
                "name": "",
                "price": "",
                "rating": 0,
                "image": ""
            },
            "album": {
                "id": "",
                "token": "",
                "name": "",
                "image": "",
                "favs": "",
                "permalink": ""
            }
        }
    });

    return ItemModel;
});