(function($, window){
    var pleimoCarousel = $.pleimoCarousel = {};

    pleimoCarousel.version = '@VERSION';

    pleimoCarousel.base = function(pluginName) {
        return {
            version: pleimoCarousel.version,
            _options: {},
            _element: null,
            _init:     $.noop,
            _create:   $.noop,
            _destroy:  $.noop,
            _reload:   $.noop,
            create: function() {

            },
            create: function() {
                this._element
                    .attr('data-' + pluginName.toLowerCase(), true)
                    .data(pluginName, this);

                if (false === this._trigger('create')) {
                    return this;
                }

                this._create();

                this._trigger('createend');

                return this;
            },
            destroy: function() {
                if (false === this._trigger('destroy')) {
                    return this;
                }

                this._destroy();

                this._trigger('destroyend');

                this._element
                    .removeData(pluginName)
                    .removeAttr('data-' + pluginName.toLowerCase());

                return this;
            },
            reload: function(options) {
                if (false === this._trigger('reload')) {
                    return this;
                }

                if (options) {
                    this.options(options);
                }

                this._reload();

                this._trigger('reloadend');

                return this;
            },
            element: function() {
                return this._element;
            },
            options: function(key, value) {
                if (arguments.length === 0) {
                    return $.extend({}, this._options);
                }

                if (typeof key === 'string') {
                    if (typeof value === 'undefined') {
                        return typeof this._options[key] === 'undefined' ?
                            null :
                            this._options[key];
                    }

                    this._options[key] = value;
                } else {
                    this._options = $.extend({}, this._options, key);
                }

                return this;
            },
            _trigger: function(type, element, data) {
                var event,
                    defaultPrevented = false;

                data = [this].concat(data || []);

                (element || this._element).each(function() {
                    event = $.Event((pluginName + ':' + type).toLowerCase());

                    $(this).trigger(event, data);

                    if (event.isDefaultPrevented()) {
                        defaultPrevented = true;
                    }
                });

                return !defaultPrevented;
            }
        };
    };

    pleimoCarousel.plugin = function(pluginName, pluginPrototype) {
        var Plugin = $[pluginName] = function(element, options) {
            this._element = $(element);
            this.options(options);

            this._init();
            this.create();
        };

        Plugin.fn = Plugin.prototype = $.extend(
            {},
            pleimoCarousel.base(pluginName),
            pluginPrototype
        );

        $.fn[pluginName] = function(options) {
            var args        = Array.prototype.slice.call(arguments, 1),
                returnValue = this;

            if (typeof options === 'string') {
                this.each(function() {
                    var instance = $(this).data(pluginName);

                    if (!instance) {
                        return $.error(
                            'Cannot call methods on ' + pluginName + ' prior to initialization; ' +
                                'attempted to call method "' + options + '"'
                        );
                    }

                    if (!$.isFunction(instance[options]) || options.charAt(0) === '_') {
                        return $.error(
                            'No such method "' + options + '" for ' + pluginName + ' instance'
                        );
                    }

                    var methodValue = instance[options].apply(instance, args);

                    if (methodValue !== instance && typeof methodValue !== 'undefined') {
                        returnValue = methodValue;
                        return false;
                    }
                });
            } else {
                this.each(function() {
                    var instance = $(this).data(pluginName);

                    if (instance instanceof Plugin) {
                        instance.reload(options);
                    } else {
                        new Plugin(this, options);
                    }
                });
            }

            return returnValue;
        };

        return Plugin;
    };

    $.pleimoCarousel.plugin('pleimocarousel', {
        _totalPages: 0,
        _pageW: 0,
        _pageH: 0,
        _currentPage: 0,
        _prev: null,
        _next: null,
        _responsive: [],
        vertical: true,
        _options: {
            list: function() {
                return this.element().children().eq(0);
            },
            items: function() {
                return this.list().children();
            },
            width: 0,
            height: 410,
            cols: 5,
            rows: 2,
            responsive: [
                {
                    'device-width': 400,
                    cols: 1,
                    rows: 2,
                    height: 340,
                    itemsProperties: {
                        width: 180,
                        height: 180
                    }
                },
                {
                    'device-width': 640,
                    cols: 3,
                    rows: 2,
                    itemsProperties: {
                        width: 170,
                        height: 190
                    }
                },
                {
                    'device-width': 767,
                    cols: 3,
                    rows: 2,
                    itemsProperties: {
                        width: 170,
                        height: 190
                    }
                },
                {
                    'device-width': 800,
                    cols: 3,
                    rows: 2
                },
                {
                    'device-width': 1024,
                    cols: 4,
                    rows: 2
                }
            ],
            vertical: true,
            itemsProperties: {
                width: 210,
                height: 220
            },
            prev: '#artists-prev',
            next: '#artists-next'
        },

        _list: null,
        _items: null,

        /*var el = this;
         var items = settings.items.selector;
         var cols = settings.cols;
         var rows = settings.rows;
         var width = settings.width;
         var height = settings.height;
         var w = settings.items.w;
         var h = settings.items.h;
         var direction = settings.direction;
         var prev = settings.prev;
         var next = settings.next;

         var pages = Math.ceil(el.find(items).length / (cols * rows));
         var qRows = Math.ceil(el.find(items).length / cols);
         var qCols = Math.ceil(el.find(items).length / rows);
         */

        _init: function() {
            var self = this;

            this.onWindowResize = function() {
                if (self.resizeTimer) {
                    clearTimeout(self.resizeTimer);
                }

                self.resizeTimer = setTimeout(function() {
                    self.reload();
                }, 100);
            };

            return this;
        },
        _create: function() {
            var el = this.element();
            el.hide();

            this._reload();
            $(window).on('resize.pleimocarousel', this.onWindowResize);

            el.data['pleimocarousel-obj'] = this;

            var self = this;
            if (this._prev != null) {
               // $(this._prev).hide();
                $(this._prev).on('click', function(e) {
                    if (!$(this).hasClass('disabled')) {
                        self.pagePrev();
                    }
                    e.preventDefault();
                });
            }

            if (this._next != null) {
                // $(this._next).hide();
                $(this._next).on('click', function(e) {
                    if (!$(this).hasClass('disabled')) {
                        self.pageNext();
                    }
                    e.preventDefault();
                });
            }
        },
        _destroy: function() {
            $(window).off('resize.pleimocarousel', this.onWindowResize);
        },
        _reload: function() {
            var el = this.element();
            var items = this.items();
            var len = items.length;
            var cols = this.options('cols');
            var rows = this.options('rows');
            var width = this.options('width');
            var height = this.options('height');
            var p = this.options('itemsProperties');
            var w = p.width;
            var h = p.height;
            this._responsive = this.options('responsive');
            this._prev = this.options('prev');
            this._next = this.options('next');

            this.vertical = this.options('vertical');

            el.addClass('pleimoCarousel_wrapper');
            this.list().addClass('pleimoCarousel');

            // responsive
            this._responsive.sort(function(a,b) {
                return b['device-width']-a['device-width'];
            });

            var rLen = (this._responsive) ? this._responsive.length : 0;
            if (rLen > 0) {
                var winW = $(window).width();
                for (var i = 0; i < rLen; i++) {
                    if (winW <= this._responsive[i]['device-width']) {
                        cols = this._responsive[i]['cols'] || cols;
                        rows = this._responsive[i]['rows'] || rows;
                        width = this._responsive[i]['width'] || width;
                        height = this._responsive[i]['height'] || height;
                        p = this._responsive[i]['itemsProperties'] || p;
                        w = p.width || w;
                        h = p.height || h;
                    }
                }
            }

            this._totalPages = Math.ceil(len / (cols * rows));
            var qRows = Math.ceil(len / cols);
            var qCols = Math.ceil(len / rows);
            this._pageW = cols * w;
            this._pageH = rows * h;

            var calcW = (width > 0) ? width : (cols * w)+'px';
            var calcH = (height > 0) ? height : (rows * h)+'px';

            el.css({ width: calcW, height: calcH });

            this.list().css({ width: (qCols * w)+'px', height: (rows * h)+'px' });

            if (this.vertical) {
                this.list().css({ width: (cols * w)+'px', height: (qRows * h)+'px' });
            }
            if ((qCols <= cols) && (qRows <= rows)) {
                $(this._prev).addClass('disabled');
                $(this._next).addClass('disabled');
            } else {
                $(this._prev).removeClass('disabled');
                $(this._next).removeClass('disabled');
            }
            el.fadeIn();
            this.goToPage(0);
        },
        list: function() {
            if (this._list === null) {
                var option = this.options('list');
                this._list = $.isFunction(option) ? option.call(this) : this._element.find(option);
            }

            return this._list;
        },
        items: function() {
            if (this._items === null) {
                var option = this.options('items');
                this._items = ($.isFunction(option) ? option.call(this) : this.list().find(option)).not('[data-pleimocarousel-clone]');
            }

            return this._items;
        },
        goToPage: function(page) {
            if (page < this._totalPages) {
                if (page > 0) {
                    if (this.vertical) {
                        this.list().animate({ 'top': 0 - Math.ceil(page * this._pageH) + 'px' }, 400, 'swing');
                    } else {
                        this.list().animate({ 'left': 0 - Math.ceil(page * this._pageW) + 'px' }, 400, 'swing');
                    }

                    $(this._next).removeClass('disabled');
                } else {

                    if (this.vertical) {
                        this.list().animate({ 'top': '0px' }, 400, 'swing');
                    } else {
                        this.list().animate({ 'left': '0px' }, 400, 'swing');
                    }

                    $(this._prev).addClass('disabled');

                    if (this._totalPages > 1) {
                        $(this._next).removeClass('disabled');
                    }
                }
                this._currentPage = page;
            }
            if (page == this._totalPages - 1) {
                $(this._next).addClass('disabled');
            }
            if ((page > 0) && (this._totalPages > 1)) {
                $(this._prev).removeClass('disabled');
            }
        },
        pagePrev: function() {
            if (this._currentPage > 0) {
                this.goToPage(this._currentPage-1);
            }
        },
        pageNext: function() {
            if (this._currentPage < this._totalPages) {
                this.goToPage(this._currentPage+1);
            }
        }
    });
})(jQuery, window);