define(function(require){
    "use strict";

    var $                = require('jquery'),
        _                = require ('underscore'),
        Backbone         = require('backbone'),
        ItemArtistView   = require('views/search/ItemArtistView'),
        ItemSongView     = require('views/search/ItemSongView'),
        ItemAlbumView    = require('views/search/ItemAlbumView'),
        ItemRadioView    = require('views/search/ItemRadioView'),
        ItemVideoView    = require('views/search/ItemVideoView'),
        ItemProductView  = require('views/search/ItemProductView');

    var TopView = Backbone.View.extend({
        el: "#top-result ul",
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
            $('#top-result').removeClass('done loading empty');

            return this;
        },

        reset: function() {
            $(this.el).empty();
            $('#top-result').removeClass('done loading empty');
            this._views = [];
        },

        hide: function() {
            $("#top-result").fadeOut();
        },

        show: function() {
            $("#top-result").show();
        },

        add: function (model) {
            var view;

            switch (model.get('type')) {
                case "artist":
                    view = new ItemArtistView({ model: model });
                    break;
                case "song":
                    view = new ItemSongView({ model: model });
                    break;
                case "product":
                    view = new ItemProductView({ model: model });
                    break;
                case "radio":
                    view = new ItemRadioView({ model: model });
                    break;
                case "video":
                    view = new ItemVideoView({ model: model });
                    break;
                case "album":
                    view = new ItemAlbumView({ model: model });
                    break;
            }

            this._views.push(view);

            if (this._rendered) {
                $(this.el).append(view.render().el);
            }
        },
        loading: function() {
            $('#top-result').removeClass('done empty').addClass('loading');
        },
        done: function() {
            $('#top-result').removeClass('loading empty').addClass('done');
        },
        empty: function() {
            $('#top-result').removeClass('loading done').addClass('empty');
        }
    });

    return TopView;
});