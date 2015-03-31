define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone'),
        ItemModel       = require('models/search/ItemModel'),
        ItemsCollection = require('collections/search/ItemsCollection'),
        MoreModel       = require('models/search/MoreModel'),
        MoreCollection  = require('collections/search/MoreCollection'),
        MoreView        = require('views/search/MoreView'),
        DetailArtistView   = require('views/search/DetailArtistView'),
        DetailSongView     = require('views/search/DetailSongView'),
        DetailAlbumView    = require('views/search/DetailAlbumView'),
        DetailRadioView    = require('views/search/DetailRadioView'),
        DetailVideoView    = require('views/search/DetailVideoView'),
        DetailProductView  = require('views/search/DetailProductView'),
        TopView         = require('views/search/TopView'),
        ContentFactory  = require('views/ContentFactory');

    var viewFactory = new ContentFactory();

    var Detail = {
        getView: function(type) {
            var view = new DetailArtistView();
            switch (type) {
                case "artist":
                    view = new DetailArtistView();
                    break;
                case "song":
                    view = new DetailSongView();
                    break;
                case "product":
                    view = new DetailProductView();
                    break;
                case "radio":
                    view = new DetailRadioView();
                    break;
                case "video":
                    view = new DetailVideoView();
                    break;
                case "album":
                    view = new DetailAlbumView();
                    break;
            }
            return view;
        }
    };

    var SearchView = Backbone.View.extend({
        MIN_CHARS: 2,
        _isClosed: true,
        _isDetail: false,

        el: "#main-search",
        timer: null,
        last: '',
        req: null,
        topview: null,
        moreview: null,
        detailview: null,

        initialize: function() {
        },
        render: function() {
            var that = this;

            viewFactory.loadTemplate('/search/main', {
                success: function(data) {
                    $('#search-view').html(data);
                    that.addEvents();
                    that.topview = new TopView({ collection: new ItemsCollection() });
                    that.moreview = new MoreView({ collection: new MoreCollection() });
                }
            },{ triggerLoaded: false });
        },
        addEvents: function() {
            var that = this;

            $(document).off('.search')
                .on('keyup.search', function(e) {
                    if (e.keyCode == 27) {
                        $('#q').eq(0).blur();
                        that.close();
                    }
                })
                .on('focus.search', '#q', function() {
                    that.toggleView(false);
                })
                .on('focus.search', '#top-search', function() {
                    that.open();
                })
                .on('click.search', '#q', function() {
                    that.toggleView(false);
                    that.search($(this).val());
                })
                .on('click.search', '#top-search', function() {
                    that.open();
                })
                .on('click.search', '#search-form a.btn-close', function() {
                    that.close();
                })
                .on('keyup.search', '#q', function() {
                    that.search($(this).val());
                });

            this.$el.off('.search')
                .on('click.search', '[data-href]', function () {
                    that.close();
                })
                .on('click.search', '.load', function() {
                    that.close();
                });

            return this;
        },
        search: function(val) {
            if (window.DEBUG) console.log('SearchView.search: '+ val);
            var that = this;

            this.toggleView(false);

            if (this.last != val) {
                this.reset();

                if (val.length >= this.MIN_CHARS) {
                    if(this.timer){
                        clearTimeout(this.timer);
                        this.timer = null;
                        if (this.req) this.req.abort();
                    }
                    this.timer = setTimeout(function() {
                        that.process(val);
                    }, 300);
                }
            }
        },
        toggleView: function(isDetail) {

            this._isDetail = (typeof isDetail == "boolean") ? isDetail : !this._isDetail;

            if (this._isDetail) {
                this.topview.hide();
                this.moreview.hide();
                if (this.detailview) this.detailview.show();
            } else {
                this.topview.show();
                this.moreview.show();
                if (this.detailview) this.detailview.hide();
            }
        },
        process: function(val) {
            if (window.DEBUG) console.log('SearchView.process: '+ val);
            var that = this;

            clearTimeout(this.timer);
            this.timer = null;

            this.last = val;

            if (this.req) this.req.abort();

            this.topview.loading();

            var musicbox = (window.pleimo.Session.get('musicbox')) ? window.pleimo.Session.get('musicbox') : null;

            this.req = $.ajax({
                url: 'http://api.pleimo.com/search/all/json',
                method: "GET",
                data: {
                    q: val,
                    musicbox : musicbox,
                    api_key:'bd7203c61a13f6a8a6a039255cd26359'
                },
                success: function(data) {
                    that.update(data);
                },
                done: function() {
                    that.topview.done();
                }
            });
        },
        reset: function() {
            this.topview.collection.reset();
            this.topview.render();

            this.moreview.collection.reset();
            this.moreview.render();
        },
        update: function(data) {
            this.reset();

            if (data) {
                var len;
                if (data.topresults > 0) {
                    len = data.results.length;
                    for (var i = 0; i < len; i++ ) {
                        this.topview.collection.add(new ItemModel(data.results[i]));
                    }

                    if (data.totalfound > 0) {
                        len = data.more.length;
                        for (var j = 0; j < len; j++ ) {
                            this.moreview.collection.add(new MoreModel(data.more[j]));
                        }
                    }
                } else {
                    this.topview.empty();
                }

                this.subviewEvents();
            }
        },
        subviewEvents: function() {
            var that = this;
            this.$el
                .off('.more-search')
                .on('click.more-search', 'a.see-all', function() {
                    var type = $(this).data('type');
                    that.processDetail(type);
                })
                .on('click.more-search', 'a.search-back', function() {
                    that.toggleView(false);
                });
        },
        processDetail: function(type) {
            var that = this;

            this.detailview = Detail.getView(type);

            this.toggleView(true);
            clearTimeout(this.timer);
            this.timer = null;

            if (this.req) this.req.abort();

            var val = this.last;

            var url = '//api.pleimo.com/search/' + type + '/json';
            var musicbox = (window.pleimo.Session.get('musicbox')) ? window.pleimo.Session.get('musicbox') : null;

            this.req = $.ajax({
                url: url,
                method: "GET",
                data: {
                    q : val,
                    musicbox : musicbox,
                    api_key :'bd7203c61a13f6a8a6a039255cd26359'
                },
                success: function(data) {
                    that.detailview.update(data);
                    that.detailview.render();
                }
            });
        },
        open: function() {
            $('#q').eq(0).focus();

            if (this._isClosed) {
                this._isClosed = false;

                this.$el.fadeIn(300, function() {
                    $('#q').eq(0).focus().select();
                });
            }
        },
        close: function() {
            if (!this._isClosed) {
                this._isClosed = true;
                this.$el.fadeOut(200);
            }
        }
    });

    return SearchView;
});