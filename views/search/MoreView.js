define(function(require){
    "use strict";

    var $                = require('jquery'),
        _                = require ('underscore'),
        Backbone         = require('backbone'),
        MoreArtistView   = require('views/search/MoreArtistView'),
        MoreSongView     = require('views/search/MoreSongView'),
        MoreAlbumView    = require('views/search/MoreAlbumView'),
        MoreRadioView    = require('views/search/MoreRadioView'),
        MoreVideoView    = require('views/search/MoreVideoView'),
        MoreProductView  = require('views/search/MoreProductView');

    var MoreView = Backbone.View.extend({
        el: "#result",
        initialize: function() {
            _(this).bindAll('add');

            this._views = [];

            this.collection.each(this.add);
            this.collection.bind('add', this.add);
            this.collection.bind('reset', this.reset);
        },

        render: function() {
            this._rendered = true;

            $(this.el).empty();

            return this;
        },

        reset: function() {
            $(this.el).empty();
            this._views = [];
        },

        hide: function() {
            this.$el.hide();
        },

        show: function() {
            this.$el.show();
        },

        add: function (model) {
            var view;

            switch (model.get('type')) {
                case "artists":
                    view = new MoreArtistView({ model: model });
                    break;
                case "songs":
                    view = new MoreSongView({ model: model });
                    break;
                case "products":
                    view = new MoreProductView({ model: model });
                    break;
                case "radios":
                    view = new MoreRadioView({ model: model });
                    break;
                case "videos":
                    view = new MoreVideoView({ model: model });
                    break;
                case "albums":
                    view = new MoreAlbumView({ model: model });
                    break;
            }
            this._views.push(view);

            if (this._rendered) {
                $(this.el).append(view.render().el);
            }
        }
    });

    return MoreView;
});