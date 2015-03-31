// PrivacyPolicyView.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        ModalModel      = require('models/ui/ModalModel'),
        ModalView       = require('views/ui/ModalView');

    var PrivacyPolicyView = ModalView.extend({
        initialize: function() {
            this.model = new ModalModel({
                className: '.modal.terms',
                content: ''
            });

            this.model.on('change:isOpen', this.toggle, this);
        },
        events: {
            "click a.btn-close": "close"
        },
        render: function() {
            var template = '/terms/privacy';

            var that = this;
            $.ajax({
                type : "GET",
                url  : template
            }).done(function(data){
                that.setContent(data);
            });
        }
    });

    return PrivacyPolicyView;
});