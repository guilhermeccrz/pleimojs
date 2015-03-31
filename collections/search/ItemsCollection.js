define(function(require){
    "use strict";

    var Backbone    = require('backbone'),
        ItemModel   = require('models/search/ItemModel');

    var ItemsCollection = Backbone.Collection.extend({
        model: ItemModel
    });

    return ItemsCollection;
});