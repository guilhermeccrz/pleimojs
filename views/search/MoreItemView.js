define(function(require){
    "use strict";

    var _               = require('underscore'),
        Backbone        = require('backbone'),
        ContentFactory  = require('views/ContentFactory');

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

    var MoreItemView = Backbone.View.extend({
        url: '',
        tagName: 'div',
        className: '',
        initialize: function() {
        },
        render: function() {
            var that = this;
            this.$el.addClass('box-more loading');
            this.$el.addClass(this.className);

            viewFactory.loadTemplate(this.url, {
                success: function(html) {
                    var data = that.model.toJSON();
                    _.extend(data, viewHelpers);

                    var template = _.template(html, data);
                    that.$el.html(template);
                    that.addEvents();
                    that.$el.removeClass('loading');
                }
            });

            return this;
        }
    });

    return MoreItemView;
});