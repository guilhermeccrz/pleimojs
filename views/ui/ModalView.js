define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone');

    var ModalView = Backbone.View.extend({
        scroll: null,
        el: "#modal-container",
        view: null,
        initialize: function() {
        },
        events: {
            "click #mask": "close"
        },
        toggle: function() {
          if (this.model.get('isOpen')) {
              this.scroll = $(document).scrollTop();

              $("#mask").show();
              $(document).scrollTop(0);

              this.$el.find(this.model.get('className')).addClass('open').show();
          } else {
              $("#mask").hide();
              $(document).scrollTop(this.scroll);

              this.scroll = null;
              //errors = false;

              if ($('.zoomContainer').length > 0) {
                  $('.zoomContainer').remove(); // remove zoom container from DOM
              }

              this.$el.find(this.model.get('className')).removeClass('open').hide();
              //$(".blackbox, .outbox").remove();
          }
        },
        open: function() {
            if (!this.model.get('isOpen')) {
                this.model.set('isOpen', true);
            }
        },
        close: function() {
            if (this.model.get('isOpen')) {
                this.model.set('isOpen',false);
            }
        },
        setContent: function(html) {
            this.model.set({content: html});

            var className = this.model.get('className');

            if (this.$el.find(className).length !== 0) {
                this.$el.find(className).remove();
            }


            $('.modal').remove();

            this.$el.append(html);

            var that = this;
            $('#mask').off('click').on('click.modal', function() {
                that.close();
            });

            this.open();
        }
    });

    return ModalView;

});