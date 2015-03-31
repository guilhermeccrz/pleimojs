define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone');




    var DashboardMenuView = Backbone.View.extend({



        render: function(){
            var pleimo = window.pleimo;

            pleimo.Dropdown = {
                initialized: false,
                timer: null,
                init: function() {
                    if (!this.initialized) {
                        this.initialized = true;
                        this.addEvents();
                    }
                },

                addEvents: function() {
                    /* menu click */
                    $(document).off('click.dropdown').on('click.dropdown', '[data-dropdown]', function(e) {
                        e.preventDefault();
                        pleimo.Dropdown.toggle('#' + $(this).data('dropdown'));
                    });

                    $(document).off('mouseover.dropdown').on('mouseover.dropdown', '[data-dropdown-content]', function() {
                        pleimo.Dropdown.open('#' + $(this).data('dropdown'));
                    });

                    $(document).off('mouseout.dropdown').on('mouseout.dropdown', '[data-dropdown], [data-dropdown-content]', function() {
                        pleimo.Dropdown.out('#' + $(this).data('dropdown'));
                    });

                    $(document).off('mouseleave.dropdown').on('mouseleave.dropdown', '[data-dropdown], [data-dropdown-content]', function() {
                        pleimo.Dropdown.out('#' + $(this).data('dropdown'));
                    });
                },
                out: function(el) {
                    if (this.timer == null) {
                        this.timer = setTimeout(pleimo.Dropdown.close, 500);
                    }
                },
                close: function() {
                    clearTimeout(this.timer);
                    this.timer = null;
                    $('[data-dropdown-content]').removeClass('open');
                },
                open: function(el) {
                    clearTimeout(this.timer);
                    this.timer = null;

                    $(el).addClass('open');
                },
                toggle: function(el) {
                    clearTimeout(this.timer);
                    this.timer = null;

                    if ($(el).hasClass('open')) {
                        pleimo.Dropdown.close();
                    } else {
                        pleimo.Dropdown.open(el);
                    }
                }
            };

            if ($('[data-dropdown]').length > 0) {
                pleimo.Dropdown.init();
            }

            window.pleimo = pleimo;
        }
    });

    return DashboardMenuView;
});