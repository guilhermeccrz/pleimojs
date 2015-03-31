define(function(require){
    "use strict";

    var Backbone = require('backbone');

    var DetailModel = Backbone.Model.extend({
        defaults: {
            "totalfound": 0,
            "topresults": 0,
            "results": []
        }
    });

    return DetailModel;
});