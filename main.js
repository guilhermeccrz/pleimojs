window.name = "NG_DEFER_BOOTSTRAP!";
window.DEBUG = false;

require.config({
    baseUrl: '/templates/pleimo/javascript',
    paths: {
        requireLib: 'libs/require',
        app: 'app',
        router: 'router',
        GA: 'gga',
        jquery: 'libs/jquery/jquery',
        jquery_history: 'libs/jquery.history',
        jquery_jcarousel: 'libs/jquery.jcarousel.min',
        jquery_ui: 'libs/jquery-ui-1.10.3.custom.min',
        //jquery_ui_slider: 'libs/jquery-ui.min',
        jquery_tmpl: 'libs/jquery-tmpl/jquery.tmpl.min',
        jquery_mask: 'libs/jquery.mask.min',
        backbone: 'libs/backbone/backbone',
        underscore: 'libs/underscore/underscore',
        imagesloaded: 'libs/imagesloaded/imagesloaded.pkgd.min',
        pleimo_carousel: 'libs/pleimo.carousel',
        jplayer: 'libs/jquery.jplayer.min',
        playlist: 'libs/jplayer.playlist',
        bootstrap: 'libs/bootstrap.min',
        tooltip: 'libs/bootstrap/tooltip',
        popover: 'libs/bootstrap/popover',
        jrating: 'libs/jrating',
        swfobject: 'libs/uploadify/swfobject',
        uploadify: 'libs/uploadify/jquery.uploadify.v2.1.4.min',
        livequery: 'libs/jquery.livequery.min',
        viewportSize: 'libs/viewportsize',
        template: 'public/template',
        home: 'public/home',
        masonry: 'libs/masonry/masonry',
        text: 'libs/requirejs-text/text',
        async: 'libs/requirejs-plugins/src/async',
        goog: 'libs/requirejs-plugins/src/goog',
        font: 'libs/requirejs-plugins/src/font',
        image: 'libs/requirejs-plugins/src/image',
        json: 'libs/requirejs-plugins/src/json',
        noext: 'libs/requirejs-plugins/src/noext',
        mdown: 'libs/requirejs-plugins/src/mdown',
        propertyParser : 'libs/requirejs-plugins/src/propertyParser',
        markdownConverter : 'libs/requirejs-plugins/src/Markdown.Converter',
        validate:'libs/jquery.validate.min',
        validatePleimo:'libs/jquery.validate.pleimo',
        elevateZoom:'libs/jquery.elevatezoom',
        carouFredSel:'libs/jquery.carouFredSel-6.2.0-packed',
        autoTab: 'libs/jquery.autotab',
        icheck: 'libs/icheck.min',
        suggest: 'libs/suggest',
        paymentPleimo: 'helpers/jquery.paymentPleimo',
        jqueryColor: 'libs/jquery.color',
        fabricAll: 'libs/fabric.all.min',
        datepick: 'libs/jquery.datepick.min',
        datepickPtBr: 'libs/jquery.datepick-pt-BR',
        svg: 'libs/svg.min',
        layout: 'helpers/layout',
        instafeed: 'libs/instafeed.min',
        cookie: 'libs/jquery.cookie',
        savetype: 'libs/jquery.savetype',

        select2: 'libs/select2/select2',
        select2_enUS: 'libs/select2/select2_locale_en-US',
        select2_esES: 'libs/select2/select2_locale_es-ES',
        select2_frFR: 'libs/select2/select2_locale_fr-FR',
        select2_itIT: 'libs/select2/select2_locale_it-IT',
        select2_ptBR: 'libs/select2/select2_locale_pt-BR',
        select2_ptPT: 'libs/select2/select2_locale_pt-PT',

        /* layout dependencies */
        "get-size": 'libs/get-size',
        outlayer: 'libs/outlayer',
        "doc-ready": 'libs/doc-ready',
        "matches-selector": 'libs/matches-selector',
        "get-style-property": 'libs/get-style-property',
    },
    shim: {
        jquery: {
            exports: '$'
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        router: {
            deps: ['jquery', 'underscore', 'backbone', 'models/SessionModel', 'views/ui/ModalView', 'template', 'views/ContentFactory']
        },
        jquery_ui: {
            deps: ['jquery']
        },
        jquery_history: {
            deps: ['jquery']
        },
        jquery_tmpl: {
            deps: ['jquery']
        },
        jquery_jcarousel: {
            deps: ['jquery']
        },
        jquery_mask: {
            deps: ['jquery']
        },
        jquery_placeholder: {
            deps: ['jquery']
        },
        validate: {
            deps: ['jquery']
        },
        validatePleimo: {
            deps: ['jquery', 'validate']
        },
        elevateZoom: {
            deps: ['jquery']
        },
        bootstrap: {
            deps: ['jquery']
        },
        pleimo_carousel: {
            deps: ['jquery', 'jquery_jcarousel']
        },
        tooltip: {
            deps: ['jquery']
        },
        popover: {
            deps: ['jquery', 'tooltip']
        },
        jplayer: {
            deps: ['jquery']
        },
        playlist: {
            deps: ['jplayer']
        },
        livequery: {
            deps: ['jquery']
        },
        uploadify: {
            deps: ['jquery']
        },
        jrating: {
            deps: ['jquery', 'jquery_ui']
        },
        masonry : {
            deps: ['jquery']
        },

        layout: {
            deps: ['jquery', 'imagesloaded', 'viewportSize', 'masonry']
        },
        validade: {
            deps: ['jquery']
        },
        carouFredSel: ['jquery'],
        datepick: {
            deps: ['jquery']
        },
        datepickPtBr: {
            deps: ['jquery', 'datepick']
        },

        select2: {deps: ['jquery']},
        select2_enUS: {deps: ['jquery', 'select2']},
        select2_esES: {deps: ['jquery', 'select2']},
        select2_frFR: {deps: ['jquery', 'select2']},
        select2_itIT: {deps: ['jquery', 'select2']},
        select2_ptBR: {deps: ['jquery', 'select2']},
        select2_ptPT: {deps: ['jquery', 'select2']},

        template: {

            deps: ['jquery',
                'jquery_ui',
                'jquery_history',
                'jplayer',
                'jquery_mask',
                'playlist',
                'bootstrap',
                'tooltip',
                'popover',
                'jrating',
                'swfobject',
                'livequery',
                'validate',
                'validatePleimo'
            ]
        }
    },
    priority: [
        "jquery"
    ]
});

require([
    'app',
    'router'
], function(app) {
    "use strict";

    app.initialize();
});