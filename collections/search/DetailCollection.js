define(function(require){
    "use strict";

    var Backbone    = require('backbone'),
        DetailModel = require('models/search/DetailModel');

    var DetailCollection = Backbone.Collection.extend({
        model: DetailModel
    });

    return DetailCollection;
});