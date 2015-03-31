// Filename: seo.js
define(function(require){

    "use strict";

    var $               = require('jquery'),
        _               = require ('underscore'),
        Backbone        = require('backbone'),
        template        = require('template');

    var helpers = {
        "parseQuery" : function(query)
        {
            var Params = new Object ();
            if ( ! query ) return Params;

            var Pairs = query.split(/[;&]/);
            for ( var i = 0; i < Pairs.length; i++ ) {
                var KeyVal = Pairs[i].split('=');

                if ( ! KeyVal || KeyVal.length != 2 ) continue;

                var key = unescape( KeyVal[0] );
                var val = unescape( KeyVal[1] );
                val = val.replace(/\+/g, ' ');
                Params[key] = val;
            }

            return Params;
        }

    }

    $(function () {

        var scripts = document.getElementsByTagName("script");

        for (i=0;i<scripts.length;i++) {

            if (scripts[i].src.indexOf("seo.js") > 0) {

                var myScript    = scripts[i];
                var queryString = myScript.src.replace(/^[^\?]+\??/,'');
                var object      = helpers.parseQuery(queryString);

                document.title = object.title;
            }
        }

    });
});