// http://fabricjs.com/interaction-with-objects-outside-canvas/
// http://stackoverflow.com/questions/12497900/replace-fabric-js-resize-and-rotate-controls-with-custom-images
// http://fabricjs.com/fabric-intro-part-4/
// http://fabricjs.com/controls-customization/

(function($, window) {
    'use strict';

    /**
     * Pleimo namespace
     * @namespace
     */
    var pleimo = window.pleimo || {};

    // imagens de icones na seleção do editor
    var V = new Image, // rotate
        W = new Image; // resize
    V.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAIAAAC0D9CtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjc0OTJBODA3NUE5NjExRTM5RDBGOTRERkY3RUZDQUYxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjc0OTJBODA4NUE5NjExRTM5RDBGOTRERkY3RUZDQUYxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzQ5MkE4MDU1QTk2MTFFMzlEMEY5NERGRjdFRkNBRjEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzQ5MkE4MDY1QTk2MTFFMzlEMEY5NERGRjdFRkNBRjEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5kBsJjAAACNUlEQVR42oRTS2tTQRQ+Z+ameaekYErULCqhpog2Eh8ppFCwND6rYEFw4cKCCwsiCP4CF3blay9IXYmPilALShfSpmqhC5WmtSKlTV/RpCnmcXMzd8abpzcG8WMYDmfOd+acM9/gj+YwVCEAsMEWpb3m1yDp7EqcSkEKtpt7jwJBeWJGnY5SpS6d9FdK1rcfLp1ydB0k2ZzmlU53Z38m868n8e4rUg2jN03eGoF3e023hhyhAOSVwqdF5fsq2MzGwD4a7FRMgO++lCMl1YqgCqBUhAOmK+fNblduPMLuPxGRee2YS8CvD9gH+y1XL2QLDIefajR640AIwofE4Fm8eKKpY09+bIo/eC4+LJQLRg4YmZMz27YzPWqbG2ejEEsQTGfAaRdHfI7Wlmw+l7caCrubi5frgCMTbHbO7m61XO4v9SN7BFMg6GMWM2Eq2eVS/e3otEAsRlJKecpEAGvbYevqZN9WCqOTpFjA5yVYThSbk6QC55hIQjwFG7+E7g0gI2ORjZVZowy4ss7Qz9JpMjYNj8dxcY3I+uqgye8TjPHVzQpHGzx/H8W9HozF8d4zupYGnQI0qH6PoS+Yy8psfvmPDvBjFJLbuJHEKoGXchUJTqN9+BoapNToFHn0htY4dEuBmaU6HRFgPR3Gc73WY4eZy5l58ZYM3aGNequD2w4nQ4bjQS4g8/Al3h4hSnX0el3roWqVeV1iZwusb+HCJv2XrvWgWkNf49pq/CAE/gds8PwWYAA3dN1Uq420UwAAAABJRU5ErkJggg==";
    W.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAIAAAC0D9CtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjc0OTJBODBCNUE5NjExRTM5RDBGOTRERkY3RUZDQUYxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjc0OTJBODBDNUE5NjExRTM5RDBGOTRERkY3RUZDQUYxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzQ5MkE4MDk1QTk2MTFFMzlEMEY5NERGRjdFRkNBRjEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzQ5MkE4MEE1QTk2MTFFMzlEMEY5NERGRjdFRkNBRjEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4yA1NnAAAA90lEQVR42mJ8we/OQCJgYiAdsEAo8cwQhgAbBkEeBlZmhn//GTqXv1y1m4AekAYjFRDj+y8Gm9yXj54S4TYuNob//0GMOVvwa0DSI8TH8OsPw/6LDCk+4rZGxOkR4GEwz3wZVs1w/znDxhbxlc1E6Mnqf/n0BZB+aZ/N8PM3w95zePQwUjl+xNMCxZ9vRHD97YmIU2cjBnZW8YNTQRqkJRimFRLlNlAYLqpiOH2TwUqL4ePXl9oxhNPOy8PnGJoXMTjqM7CxMLz7RFR6E5eTZmhIADuIkeHbL9S0g1VDmCtDeSTD248Mv/8yvP/C0L+aNmGNCwAEGAABgEuZOMgMQAAAAABJRU5ErkJggg==";

    // ajusta os icones no editor
    fabric.Object.prototype.drawControls = function (a) {
        if (!this.hasControls) return this;
        var d = this.cornerSize,
            c = d / 2,
            b = ~~ (this.strokeWidth / 2),
            e = -(this.width / 2),
            g = -(this.height / 2),
            h = d / this.scaleX,
            l = d / this.scaleY,
            m = this.padding / this.scaleX,
            n = this.padding / this.scaleY,
            p = c / this.scaleY,
            q = c / this.scaleX,
            r = (c - d) / this.scaleX,
            u = (c - d) / this.scaleY,
            v = this.height,
            w = this.width,
            x = this.transparentCorners ? "strokeRect" : "fillRect",
            s = this.transparentCorners,
            t = "undefined" !== typeof G_vmlCanvasManager;
        a.save();
        a.lineWidth = 1 / Math.max(this.scaleX, this.scaleY);
        a.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
        a.strokeStyle = a.fillStyle = this.cornerColor;
        t || s || a.clearRect(e - q - b - m, g - p - b - n, h, l);
        t || s || a.clearRect(e + w - q + b + m, g - p - b - n, h, l);
        t || s || a.clearRect(e - q - b - m, g + v + u + b + n, h, l);
        d = e + w + r + b + m;
        c = g + v + u + b + n;
        t || s || a.clearRect(d, c, h, l);
        this.lockScalingX || (a.drawImage(W, d, c, h, l), a[x](d, c, h, l));
        this.get("lockUniScaling") || (d = e + w / 2 - q, c = g - p - b - n, t || s || a.clearRect(d, c, h, l), a[x](d, c, h, l), d = e + w / 2 - q, c = g + v + u + b + n, t || s || a.clearRect(d, c, h, l), a[x](d, c, h, l), d = e + w + r + b + m, c = g + v / 2 - p, t || s || a.clearRect(d, c, h, l), a[x](d, c, h, l), d = e - q - b - m, c = g + v / 2 - p, t || s || a.clearRect(d, c, h, l), a[x](d, c, h, l));
        this.hasRotatingPoint && !this.lockRotation && (d = e + w / 2 - q, c = this.flipY ? g + v + this.rotatingPointOffset / this.scaleY - l / 2 + b + n : g - this.rotatingPointOffset / this.scaleY - l / 2 - b - n, t || s || a.clearRect(d, c, h, l), a.drawImage(V, d, c, h, l), a[x](d, c, h, l));
        a.restore();
        return this;
    }

    /**
     * @namespace
     * @alias pleimo.product
     */
    pleimo.product = {
        /**
         * @namespace
         * @alias pleimo.product.markup
         */
        markup: {
            /**
             * @method
             * @alias pleimo.product.markup.init
             */
            init: function() {
                this.selCarousel = '.product-select-carousel';
                this.selPrice = '.product-select-price';
                this.selColor = '.product-select-color';
                this.upload = '.product-upload';
                this.canvas = '.product-canvas';
                this.editArea = '.product-edit-area';
                this.nav = '.product-nav';

                this.$selCarousel = $(this.selCarousel);
                this.$selPrice = $(this.selPrice);
                this.$selColor = $(this.selColor);
                this.$upload = $(this.upload);
                this.$canvas = $(this.canvas);
                this.$editArea = $(this.editArea);
                this.$nav = $(this.nav);

                $.post(base_url+"register/product/save_confirm", function(data){ pleimo.product.markup.$saveConfirm = $(data); });
                $.post(base_url+"register/product/remove_confirm", function(data){ pleimo.product.markup.$removeConfirm = $(data); });
            }
        },
        /**
         * @method
         * @alias pleimo.product.init
         */
        init: function() {

            var product = pleimo.product,
                panel1 = product.panel1,
                panel2 = product.panel2;

            product.markup.init();

            product.markup.$nav.find('a').on('click', function(evt) {
                evt.preventDefault();

                if ( ! pleimo.product.editor.uploading )
                {
                    if ($(this).parent().index() == 0) {
                        panel1.show();
                        panel2.hide();
                    } else {
                        panel1.hide();
                        panel2.show();
                    }
                }
            });

            $(".btn-new").hide();

            $(".btn-editar").on("click",function(){
                if ( ! pleimo.product.editor.uploading )
                {
                    pleimo.product.editor.load($(this).parent().data('product'));
                }
            }).hide();

            $(".btn-deletar").on("click",function(){
                if ( ! pleimo.product.editor.uploading )
                {
                    pleimo.product.editor.remove($(this).parent().data('product'));
                }
            });

            product.editor.init();
            product.upload.init();
            panel1.init();
            panel2.init();

            pleimo.product.initProductsControls();

            $('#dpi-alert').hide();
        },
        /**
         * Initializes or reinitialize controls for deleting and editing products.
         * @method
         * @alias pleimo.product.initProductsControls
         * @author Thiago Amerssonis <t.amerssonis@pleimo.com>
         * @return void
         */
        initProductsControls: function(){
            $(".products-btns").each(function(){
                var product_id = this.data('product');
                this.find('.btn').off();

                this.find('.btn-editar').on('click',function(){

                });
            });
        },
        /**
         * @namespace
         */
        panel1: {
            initialized: false,
            init: function() {
                if (!this.initialized) {
                    this.initialized = true;

                    var $selCarousel = pleimo.product.markup.$selCarousel,
                        $selColor = pleimo.product.markup.$selColor,
                        $selPrice = pleimo.product.markup.$selPrice,
                        $canvas = pleimo.product.markup.$canvas;

                    /* carousel para escolha o produto */
                    $selCarousel.find("ul").carouFredSel({
                        circular: false,
                        width: 258,
                        align: "left",
                        height: 165,
                        items: {
                            visible: 3,
                            width: 86
                        },
                        scroll: 1,
                        auto: false,
                        prev: pleimo.product.markup.selCarousel + " .product-select-nav a.prev",
                        next: pleimo.product.markup.selCarousel + " .product-select-nav a.next"
                    });

                    /* inicializa a imagem off */
                    $selCarousel.find('li img').each(function() {
                        $(this).data('off', $(this).get(0).src);
                    });

                    /* evento selectChange do carousel */
                    $selCarousel.on("selectChange", function(evt, $el) {
                        // esconde a seleção de cores e remove as opções de cores
                        $selColor.hide();
                        $selColor.find('ul li').remove();

                        // esconde a seleção de preços e remove as opções de preços
                        $selPrice.hide();
                        $selPrice.find('p.info').html('');

                        var obj = $el.find('img').data('obj');

                        // preenche as opções de cores
                        var len = obj.cores.length;
                        if (len > 0) {
                            var html = '';
                            for (var i = 0; i < len; i++) {
                                html += '<li><a href="#" style="background-color:' + obj.cores[i].cor + '" data-id="'+obj.cores[i].id+'" data-img="' + obj.cores[i].img + '"></a></li>';
                            }

                            $selColor.find('ul').append(html);
                            $selColor.find('ul li:first-child a').click();

                            if (len > 1) {
                                $selColor.show();
                            }
                        }

                        // preenche as opções de preços
                        $selPrice.find('p.info').append(obj.preco);
                        $selPrice.show();
                    });

                    // evento clique na cor
                    $selColor.on('click', 'a', function(evt) {
                        evt.preventDefault();

                        $canvas
                            .width(599)
                            .height(500);

                        var imgsrc = $(this).data('img');
                        var img = new Image();
                        img.src = imgsrc;

                        if (img.width > 0) {
                            $canvas
                                .width(img.width)
                                .height(img.height);
                        } else {
                            img.onLoad = function() {
                                $canvas
                                    .width(img.width)
                                    .height(img.height);
                            }
                        }

                        var obj = $selCarousel.find('li.active img').data('obj');

                        var canvas = pleimo.product.editor.canvas;

                        canvas.setBackgroundImage(imgsrc, canvas.renderAll.bind(canvas));

                        // background com o produto selecionado
                        $canvas.css({
                            'top' : Number(obj.y) + 70 + 'px',
                            'left' : obj.x + 'px'
                        });

                        pleimo.product.editor.setDimensions(obj.editor.x, obj.editor.y, obj.editor.w, obj.editor.h);
                        pleimo.product.editor.maxScale = obj.editor.s;
                        pleimo.product.editor.maskFile = obj.svg;

                        $('#id-product').val($(this).data('id'));
                    });

                    // ativa / desativa imagem na seleção do produto
                    $selCarousel.find('li a').click(function(evt)
                    {
                        evt.preventDefault();

                        pleimo.product.editor.canvas.clear();

                        if ( ! $('#save-product').hasClass('disabled'))
                        {
                            $('#save-product').addClass('disabled');
                        }

                        var img;
                        $selCarousel.find('li.active img').each(function() {
                            img = $(this);
                            img.get(0).src = img.data('off');
                        });

                        $selCarousel.find('li.active').removeClass('active');

                        $(this).parent().addClass('active');
                        img = $(this).find('img');
                        img.get(0).src = img.data('obj').on;
                        var idx = $(this).parent().index();

                        $selCarousel.trigger("selectChange", [$(this)]);
                    });

                    // seleciona o primeiro produto
                    $selCarousel.find('li:eq(0) a').click();

                    // avançar
                    $('.btn-next').click(function() {
                        pleimo.product.panel1.hide();
                        pleimo.product.panel2.show();
                    });
                }
            },
            hide: function() {
                pleimo.product.markup.$editArea.removeClass('step-1');
                pleimo.product.markup.$selColor.hide();

            },
            show: function() {
                pleimo.product.markup.$nav.find('li.active').removeClass('active');
                pleimo.product.markup.$nav.find('li:eq(0)').addClass('active');

                pleimo.product.markup.$editArea.addClass('step-1');
                pleimo.product.markup.$selColor.show();
            }
        },
        panel2: {
            initialized: false,
            init: function() {
                if (!this.initialized)
                {
                    pleimo.product.editor.loadPrints();

                    this.initialized = true;

                    $(".btn-upload").on('click',function(){
                        $('#stamp-upload').click();
                    });

                    $("#save-product").on("click", function(){
                        pleimo.product.editor.save();
                    });
                }
            },
            hide: function() {
                pleimo.product.markup.$editArea.removeClass('step-2');
                pleimo.product.markup.$upload.hide();
            },
            show: function() {
                pleimo.product.markup.$nav.find('li.active').removeClass('active');
                pleimo.product.markup.$nav.find('li:eq(1)').addClass('active');

                pleimo.product.markup.$editArea.addClass('step-2');
                pleimo.product.markup.$upload.show();
            }
        },
        /**
         * @namespace
         * @alias pleimo.product.editor
         */
        editor: {
            /**
             * Canvas com fabric.js
             * @type {fabric.Canvas}
             * @see {@link http://fabricjs.com/docs/fabric.Canvas.html}
             */
            canvas: null,
            /**
             * Checa inicialização
             * @type {Boolean}
             */
            initialized: false,
            /**
             * Valor da largura do canvas
             * @type {Number}
             */
            width: 200,
            /**
             * Valor da altura do canvas
             * @type {Number}
             */
            height: 400,
            /**
             * Valor da scala máxima do produto
             * @type {Number}
             */
            maxScale: 1,
            /**
             * Objeto de auxilio visual para o usuário
             * @type {fabric.Rect}
             */
            printArea: null,
            /**
             * Objeto contendo a imagem manipulavel pelo usuário
             * @type {fabric.Image}
             */
            imageObject: null,
            /**
             * Valor do caminho para a imagem que será aplicada ao produto
             * @type {string}
             */
            printStamp: null,
            /**
             * Artist product Id will determine if the product is being edited or is a new product.
             * @type int
             */
            artistProductId: false,
            /**
             * Source path of file to be used as svg mask.
             * @type string
             */
            maskFile: false,
            /**
             * Input control variable to avoid bugs.
             * @type bool
             */
            uploading: false,
            /**
             * inicializa o editor
             * @method init
             * @alias pleimo.product.editor.init
             */
            init: function() {
                if (!this.initialized) {
                    this.initialized = true;

                    var canvas = new fabric.Canvas('product-canvas', {
                        selection: !1,
                        hoverCursor: "pointer",
                        rotationCursor: "move"
                    });

                    this.printArea = new fabric.Rect({
                        left: 0,
                        top: 0,
                        width: 0,
                        height: 0,
                        strokeWidth: 1,
                        strokeDashArray: [2,4],
                        stroke: '#424242',
                        fill: 'rgba(0,0,0,0)',
                        selectable: false,
                        evented: false
                    });

                    canvas.add(this.printArea);

                    canvas.setHeight(400);
                    canvas.setWidth(400);
                    canvas.renderAll();

                    this.canvas = canvas;

                    $(".product-upload-carousel ul").carouFredSel({
                        circular: false,
                        width: 263,
                        align: "center",
                        height: 163,
                        items: {
                            visible: 1,
                            width: 263
                        },
                        scroll: 1,
                        auto: false,
                        prev: ".product-upload-carousel .product-select-nav a.prev",
                        next: ".product-upload-carousel .product-select-nav a.next"
                    });

                    $('.product-upload-carousel').on('click', 'li', function() {
                        if ( ! pleimo.product.editor.uploading )
                        {
                            var imgURL = $(this).data('img');
                            pleimo.product.editor.artistPrintId = $(this).data('imgid');
                            pleimo.product.editor.canvasAddImage(imgURL);
                        }
                    });
                }
            },
            /**
             * @method carouselAddImage
             * Adiciona imagem no carousel, seleciona ele no carousel e adiciona no canvas
             * @alias pleimo.product.editor.carouselAddImage
             */
            carouselAddImage: function(imageObj) {
                var item = '<li style="background:transparent url('+ imageObj.THUMBNAIL +') no-repeat center center" data-img="' + imageObj.IMG + '" data-imgId="' + imageObj.ID_ARTIST_PRINT + '"></li>';
                $(".product-upload-carousel ul").trigger("insertItem", item);
                //$(".product-upload-carousel ul").trigger("prev");
            },
            /**
             * @method canvasAddImage
             * Adiciona imagem no canvas
             * @alias pleimo.product.editor.canvasAddImage
             */
            canvasAddImage: function(imgURL) {
                var editor = pleimo.product.editor;
                var canvas = this.canvas;
                canvas.clear();

                fabric.Image.fromURL(imgURL, function(oImg) {
                    editor.settings(oImg);
                });

                pleimo.product.editor.printStamp = imgURL;

                $('#save-product').removeClass('disabled');
            },
            /**
             * @method settings
             * Define a borda do objeto adicionado no canvas e o seleciona
             * @alias pleimo.product.editor.settings
             * @author Thiago Amerssonis <t.amerssonis@pleimo.com>
             */
            settings: function(oImg) {
                var editor = pleimo.product.editor;
                var canvas = pleimo.product.editor.canvas;
                oImg = oImg;// || canvas.item(0);

                $('#dpi-alert').hide();
                pleimo.product.editor.printArea.set({stroke:'#424242',strokeWidth:1,strokeDashArray: [2,4]});

                var center = {
                    x: editor.printArea.left+editor.printArea.width / 2,
                    y: editor.printArea.top+editor.printArea.height / 2
                };

                /*pleimo.product.editor.mask = new fabric.Rect({
                 originX:'center',
                 originY:'center',
                 fill: 'rgba(0,0,0,0)',
                 selectable: false,
                 evented: false
                 });*/
                fabric.loadSVGFromURL(pleimo.product.editor.maskFile, function (objects){
                    pleimo.product.editor.mask = new fabric.PathGroup(objects);

                    pleimo.product.editor.mask.set({
                        originX:'left',
                        originY:'top',
                        fill: 'rgba(255,0,0,0)',
                        selectable: false,
                        evented: false
                    });

                    //canvas.add(pleimo.product.editor.mask);

                    var settings = {
                        borderColor: '#999999',
                        cornerColor: 'transparent',
                        rotatingPointOffset: 8,
                        left: center.x - (oImg.width / 2),
                        top: center.y - (oImg.height / 2),
                        lockUniScaling: true,
                        lockRotation: true,
                        clipTo: function(ctx)
                        {
                            pleimo.product.editor.mask.render(ctx);
                        }
                    };

                    var scale = 1;

                    if (oImg.width > (editor.width - 30))
                    {
                        scale = (editor.width - 30) / oImg.width;
                    }

                    if (oImg.height > (editor.height - 30))
                    {
                        scale = Math.min(scale, (editor.height - 30) / oImg.height);
                    }

                    if (scale > editor.maxScale)
                    {
                        scale = editor.maxScale;
                    }

                    //if (scale < 1) {
                    settings.scaleX = scale;
                    settings.scaleY = scale;
                    settings.left = center.x - ((oImg.width*scale) / 2);
                    settings.top = center.y - ((oImg.height*scale) / 2);
                    //}

                    settings.currentHeight = oImg.height*scale;
                    settings.currentWidth = oImg.width*scale;

                    oImg.set(settings);

                    var posX = (200 - oImg.getCenterPoint().x);
                    var posY = (200 - oImg.getCenterPoint().y);

                    pleimo.product.editor.mask.set({
                        originX:'left',
                        originY:'top',
                        left: posX / oImg.scaleX,
                        top: posY / oImg.scaleX,
                        //width: pleimo.product.editor.printArea.width / oImg.scaleX,
                        //height: pleimo.product.editor.printArea.height / oImg.scaleX,
                        scaleX: 1/oImg.scaleX,
                        scaleY: 1/oImg.scaleY,
                        angle: -oImg.angle

                    });

                    pleimo.product.editor.imageObject = oImg;

                    canvas.add(oImg);
                    canvas.add(pleimo.product.editor.printArea);

                    canvas.renderAll();

                    canvas.setActiveObject(oImg);
                });

                oImg.on("moving", function(){
                    /*
                     if (this.left < pleimo.product.editor.printArea.left)
                     {
                     this.left = pleimo.product.editor.printArea.left;
                     }
                     else if (this.left > (pleimo.product.editor.printArea.width + pleimo.product.editor.printArea.left) - (this.width*this.scaleX))
                     {
                     this.left = (pleimo.product.editor.printArea.width + pleimo.product.editor.printArea.left) - (this.width*this.scaleX);
                     }

                     if (this.top < pleimo.product.editor.printArea.top)
                     {
                     this.top = pleimo.product.editor.printArea.top;
                     }
                     else if (this.top > (pleimo.product.editor.printArea.height + pleimo.product.editor.printArea.top) - (this.height*this.scaleY))
                     {
                     this.top = (pleimo.product.editor.printArea.height + pleimo.product.editor.printArea.top) - (this.height*this.scaleY);
                     }
                     */

                    var posX = (200 - this.getCenterPoint().x);
                    var posY = (200 - this.getCenterPoint().y);

                    pleimo.product.editor.mask.set({
                        originX:'left',
                        originY:'top',
                        left: posX / this.scaleX,
                        top: posY / this.scaleX,
                        //width: pleimo.product.editor.printArea.width / this.scaleX*2,
                        //height: pleimo.product.editor.printArea.height / this.scaleX*2,
                        scaleX: 1/this.scaleX,
                        scaleY: 1/this.scaleY,
                        angle: -this.angle
                    });
                });
                oImg.on("rotating", function(){
                });
                oImg.on("scaling", function(){
                    var editor = pleimo.product.editor;

                    $('#dpi-alert').hide();
                    pleimo.product.editor.printArea.set({stroke:'#424242',strokeWidth:1,strokeDashArray: [2,4]});

                    if (this.scaleX > editor.maxScale || this.scaleY > editor.maxScale)
                    {
                        pleimo.product.editor.printArea.set({stroke:'#e40046',strokeWidth:2,strokeDashArray: [8,8]});
                        $('#dpi-alert').show();
                    }

                    var posX = (200 - this.getCenterPoint().x);
                    var posY = (200 - this.getCenterPoint().y);

                    pleimo.product.editor.mask.set({
                        originX:'left',
                        originY:'top',
                        left: posX / this.scaleX,
                        top: posY / this.scaleX,
                        //width: pleimo.product.editor.printArea.width / this.scaleX,
                        //height: pleimo.product.editor.printArea.height / this.scaleX,
                        scaleX: 1/this.scaleX,
                        scaleY: 1/this.scaleY,
                        angle: -this.angle
                    });

                });
            },
            /**
             * @method setDimensions
             * Redimensiona a área editável do canvas
             * @alias pleimo.product.editor.resize
             */
            resize: function(w, h) {
                var canvas = this.canvas;

                canvas.calcOffset();
                canvas.renderAll();
            },
            /**
             * @method setDimensions
             * Redimensiona e reposiciona a área editável do canvas
             * @alias pleimo.product.editor.setDimensions
             */
            setDimensions: function(x, y, w, h) {
                var container = pleimo.product.markup.$canvas.find('.canvas-container');
                container.css({
                    'left': 0 + 'px',
                    'top': 0 + 'px'
                });

                pleimo.product.editor.printArea.set({
                    left: x,
                    top: y,
                    width: w,
                    height: h
                });

                this.resize(w, h);
            },
            /**
             * @method save
             * Grava as imagens no banco e cria o producto do artista.
             * @returns void
             * @see load
             * @alias pleimo.product.editor.save
             */
            save: function()
            {
                if ($('#save-product').hasClass('disabled'))
                {
                    return false;
                }

                var image_obj = pleimo.product.editor.imageObject;

                var canvas = pleimo.product.editor.canvas;

                $('#dpi-alert').hide();

                canvas.deactivateAll();
                canvas.remove(pleimo.product.editor.printArea);
                canvas.renderAll();

                var image_data = canvas.toDataURL();

                openMask();

                $('.modal').hide();
                $("<div id='block-input'>").css({
                    position: "fixed",
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                    zIndex: 10000000,
                    background: "none"
                }).appendTo($("body"));

                $("body").append("<div class='modal save-product outbox'><div class='modal-loading'</div>");

                $.ajax({
                    type: "POST",
                    url: base_url+"register/product/save",
                    dataType: 'json',
                    data: {
                        'thumbnail_data': image_data,
                        'stamp_path': pleimo.product.editor.printStamp,
                        'product_x': image_obj.getCenterPoint().x - (image_obj.currentWidth/2) - pleimo.product.editor.printArea.left,
                        'product_y': image_obj.getCenterPoint().y - (image_obj.currentHeight/2) - pleimo.product.editor.printArea.top,
                        'product_height': image_obj.currentHeight,
                        'product_width': image_obj.currentWidth,
                        'product_angle': image_obj.angle,
                        'product_scale': image_obj.scaleX,
                        'product_id': $("#id-product").val(),
                        'artist_product_id': pleimo.product.editor.artistProductId,
                        'artist_print_id': pleimo.product.editor.artistPrintId
                    },
                    success: function(result)
                    {
                        if (result.status == 'success')
                        {
                            $.ajax({
                                type: "POST",
                                url: base_url + "register/product/get_product",
                                data: {'product_id': result.product_id}
                            }).done(function (data) {
                                $(".modal").remove();
                                $("body").append(pleimo.product.markup.$saveConfirm.clone());
                                $('#block-input').remove();

                                $('.save-product .btn-yes').on("click", function()
                                {
                                    $(".product-save").remove();
                                    closeMask();
                                    $('.product-list ul').append(data);
                                    $('.product-list ul li:last-child').find(".btn-editar").hide();
                                    $('.product-list ul li:last-child').find(".btn-deletar").on("click",function(){
                                        pleimo.product.editor.remove($(this).parent().data('product'));
                                    });
                                    pleimo.product.editor.canvas.clear();
                                    pleimo.product.panel2.hide();
                                    pleimo.product.panel1.show();
                                    $('#save-product').addClass('disabled');
                                });

                            }).error(function (data) {
                            });
                        }
                    }
                });
            },
            /**
             * @method load
             * Read product data from database and apply to canvas.
             * @param int product_id
             * @see save
             * @alias pleimo.product.editor.load
             */
            load: function(product_id) {
                var canvas = pleimo.product.editor.canvas;

                if (pleimo.product.editor.imageObject)
                {
                    canvas.remove(pleimo.product.editor.imageObject);
                }

                $.ajax({
                    type: "POST",
                    url: base_url+"register/product/load",
                    dataType: 'json',
                    data: { 'product_id': product_id },
                }).done(function(data){
                    $(".product-select-carousel [data-type='"+data.ID_PRODUCT_TYPE+"']").click();
                    $(".product-select-color [data-id='"+data.ID_PRODUCT+"']").click();
                    pleimo.product.editor.canvasAddImage(data.PRINT_IMG);
                }).error(function(data){
                });
            },
            /**
             * @method remove
             * Remove product from user view
             * @param int product_id
             * @see save
             * @alias pleimo.product.editor.remove
             */
            remove: function(product_id) {
                if (pleimo.product.markup.$removeConfirm)
                {
                    openMask();

                    $('.modal').hide();
                    $("body").append(pleimo.product.markup.$removeConfirm.clone());

                    $(".remove-product .btn-yes").on("click",function(){
                        $('.remove-product').html('<div class="modal-loading">');
                        $("<div id='block-input'>").css({
                            position: "fixed",
                            width: "100%",
                            height: "100%",
                            top: 0,
                            left: 0,
                            zIndex: 10000000,
                            background: "none"
                        }).appendTo($("body"));
                        $.ajax({
                            type: "POST",
                            url: base_url+"register/product/remove",
                            dataType: 'json',
                            data: { 'product_id': product_id },
                        }).done(function(data){
                            if (data.status == 'success')
                            {
                                $(".product-btns[data-product='"+product_id+"']").parent().remove();
                            }
                            $(".remove-product").remove();
                            $("#block-input").remove();
                            closeMask();
                        }).error(function(data){
                            $(".remove-product").remove();
                            $("#block-input").remove();
                            closeMask();
                        });
                    });
                }


                $(".remove-product .btn-no").on("click",function(){
                    $('.remove-product').remove();
                    closeMask();
                });
            },
            /**
             * @method loadPrints
             * Check database for prints and load them in images carousel
             * @author Thiago Amerssonis <t.amerssonis@pleimo.com>
             * @see load
             * @alias pleimo.product.editor.loadPrints
             */
            loadPrints: function(){
                $.ajax({
                    type: "POST",
                    url: base_url + "register/product/get_prints",
                    dataType: 'json'
                }).done(function (data) {
                    for (var p in data)
                    {
                        pleimo.product.editor.carouselAddImage(data[p]);
                    }
                }).error(function (data) {
                });
            }
        },
        upload: {
            init: function() {
                /* UPLOADIFY */
                $("#stamp-upload").each(function() {

                    var state = {uploading:false};

                    $(this).uploadify({
                        'uploader'        : base_url+'templates/pleimo/javascript/libs/uploadify/uploadify.swf',
                        'script'          : base_url+'upload/stamp',
                        'cancelImg'       : base_url+'templates/pleimo-s3/pleimo-assets/images/icon-cancel.png',
                        'buttonImg'	  	  : base_url+'templates/pleimo-s3/pleimo-assets/images/product_upload.png',
                        //'hideButton'      : true,
                        'width'			  : 305,
                        'height'		  : 24,
                        'folder'          : '/templates/pleimo-s3/pleimo-assets/images/products/',
                        'fileSizeLimit'   : '0',
                        'simUploadLimit'  : '100',
                        'fileExt'         : '*.jpg;*.gif;*.png;*.JPG;*.GIF;*.PNG;',
                        'fileDesc'        : 'Image Files (.JPG, .GIF, .PNG)',
                        'multi'           : false,
                        'auto'            : true,
                        'removeCompleted' : true,
                        'scriptAccess'    : 'always',
                        'wmode'		  : 'transparent',

                        'onSelect' : function(data) {
                            pleimo.product.editor.uploading = true;
                            //console.log(data);
                            $('#save-product').addClass('disabled');
                            state.uploading = true;
                        },

                        'onComplete' : function(event, fileObj, data, response)
                        {
                            window.setTimeout(function(){
                                pleimo.product.editor.uploading = false;
                            },1000);

                            if (response != 0)
                            {
                                var img_data = JSON.parse(response);

                                pleimo.product.editor.carouselAddImage(img_data);

                                pleimo.product.editor.canvasAddImage(img_data.IMG);
                            }

                        }

                    });

                });

            }
        }
    }

    window.pleimo = pleimo;

    $(document).ready(function() {
        pleimo.product.init();

        // $(".product-upload-carousel ul").append('<li style="background:transparent url(images/foto-test.png) no-repeat center center"></li>');

    });

})(jQuery, window);