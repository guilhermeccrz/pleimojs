define([
    'jquery',
    'underscore',
    'backbone',
    'router'
], function($, _, Backbone, AppRouter) {
    "use strict";

    var initialize = function() {
        AppRouter.initialize();
    };

    return {
        initialize: initialize
    };
});