define(function(require){
    "use strict";

    var Backbone = require('backbone');

    var MoreModel = Backbone.Model.extend({
        defaults: {
            "type": "",
            "count": 0,
            "items": []
        }
    });

    return MoreModel;
});