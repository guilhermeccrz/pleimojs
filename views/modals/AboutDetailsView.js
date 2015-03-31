// AboutDetailsView.js
define(function(require){
    "use strict";

    var ModalModel      = require('models/ui/ModalModel'),
        ModalView       = require('views/ui/ModalView');

    var AboutDetailsView = ModalView.extend({
        initialize: function() {
            this.model = new ModalModel({
                className: '.modal.more_about.outbox',
                content: ''
            });

            this.model.on('change:isOpen', this.toggle, this);
        },
        events: {
            "click a.btn-close": "close"
        },
        render: function() {
            var template = '/about/details';

            var that = this;
            $.ajax({
                type : "GET",
                url  : template
            }).done(function(data){
                that.setContent(data);
            });
        }
    });

    return AboutDetailsView;
});