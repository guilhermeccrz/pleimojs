// UserTermsView.js
define(function(require){
    "use strict";

    var $               = require('jquery'),
        ModalModel      = require('models/ui/ModalModel'),
        ModalView       = require('views/ui/ModalView');

    var base_url = window.base_url;

    var UserTermsView = ModalView.extend({
        initialize: function() {
            this.model = new ModalModel({
                className: '.modal.terms.wrapper.outbox',
                content: ''
            });

            this.model.on('change:isOpen', this.toggle, this);
        },
        events: {
            "click #mask": "close"
        },
        selfRemove: function(){
            $('.terms').remove();
        },
        render: function() {
            var that = this;

            $(document).off("click.terms-close").on("click.terms-close", ".terms .btn-close", function() {
                that.close();
            });

            $.ajax({
                type: "GET",
                url: base_url + "terms/users"
            }).done(function(data) {
                that.setContent(data);
            });
        }
    });

    return UserTermsView;
});