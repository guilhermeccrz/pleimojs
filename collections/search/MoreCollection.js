define(function(require){
    "use strict";

    var Backbone    = require('backbone'),
        MoreModel   = require('models/search/MoreModel');

    var MoreCollection = Backbone.Collection.extend({
        model: MoreModel
    });

    return MoreCollection;
});