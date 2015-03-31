define(function(require){
    "use strict";

    var Backbone = require('backbone');

    var ModalModel = Backbone.Model.extend({
        defaults: {
            isOpen: false,
            content: '',
            className: ''
        }
    });

    return ModalModel;

});