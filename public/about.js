// Filename: about.js
define(function(require){

    "use strict";

    var $ = require('jquery');

 /**
 * Created by c.uemura on 1/21/14.
 * @author Celina Uemura (c.uemura@pleimo.com)
 * @author Leonardo Moreira <developer@pleimo.com>
 */
    /** Open office details */
    $('#map-pins a').click(function(e) {

        var openID = $(this).attr('href');

       if  ($(openID).is(':visible')) {
           $(openID).fadeOut();
       } else {
           $('.frame-address').fadeOut();
           $(openID).fadeIn();
       }

        e.preventDefault();

    });

    /** Close office details */
    $('a.btn-close').click(function(e) {

        $(this).parent().fadeOut();
        e.preventDefault();

    });

    /** Open about details **/
    $('#more a').click(function(e) {

        openMask();

        $.ajax({
            type : "POST",
            url  : base_url+"about/details"
        }).done(function(data) {
            $('.modal').hide();
            $("body").append(data);
        });

        e.preventDefault();

    });
});