define(function(require){
    "use strict";

    var _               = require ('underscore'),
        Backbone        = require('backbone'),
        ContentFactory  = require('views/ContentFactory'),
        DetailModel     = require('models/search/DetailModel');

    var viewFactory = new ContentFactory();

    var viewHelpers = {
        cropText: function(str, qty){
            var result = str;

            if (str.length > qty) {
                result = result.substr(0, qty);
                result +='...';
            }

            return result;
        },
        getGenre: function(artist) {
            var result = artist.genre;

            if (artist.country && artist.country !== '')
            {
                result += ' | ' + artist.country;
            }

            return result;
        }
    };

    var DetailItemView = Backbone.View.extend({
        url: '',
        el: '#more-result',
        initialize: function() {
            this.model = new DetailModel();

            this.$el.empty();
        },

        render: function() {
            var that = this;
            that.loading();

            viewFactory.loadTemplate(this.url, {
                success: function(html) {
                    var data = that.model.toJSON();
                    _.extend(data, viewHelpers);

                    var template = _.template(html, data);
                    that.$el.html(template);
                    that.addEvents();
                    that.done();
                }
            });

            return this;
        },
        addEvents: function() {},
        update: function(data) {
            this.model.set(data);
        },
        loading: function() {
            this.$el.addClass('loading');
        },

        done: function() {
            this.$el.removeClass('loading');
        },
        show: function() {
            this.$el.show();
        },
        hide: function() {
            this.$el.fadeOut();
        }
    });

    return DetailItemView;
});