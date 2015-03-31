/**
 *
 * Pinterest-like script - a series of tutorials
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2012, Script Tutorials
 * http://www.script-tutorials.com/
 */


function fileSelectHandler() {
    // get selected file
    var oFile = $('#image_file')[0].files[0];

    // html5 file upload
    var formData = new FormData($('#upload_form')[0]);
    $.ajax({
        url: 'upload.php', //server script to process data
        type: 'POST',
        // ajax events
        beforeSend: function() {
        },
        success: function(e) {
            $('#upload_result').html('Thank you for your photo').show();

            setTimeout(function() {
                $("#upload_result").hide().empty();
                window.location.href = 'index.php';
            }, 4000);
        },
        error: function(e) {
            $('#upload_result').html('Error while processing uploaded image');
        },
        // form data
        data: formData,
        // options to tell JQuery not to process data or worry about content-type
        cache: false,
        contentType: false,
        processData: false
    });
}

function submitComment(form, id) {
    $.ajax({ 
      type: 'POST',
      url: 'service.php',
      data: 'add=comment&id=' + id + '&comment=' + $(form).find('textarea').val(),
      cache: false, 
      success: function(html){
        if (html) {
          location.reload();
        }
      } 
    });
    return false;
}

function initiateColorboxHandler() {
    $('.ajax').colorbox({
        onOpen:function(){
        },
        onLoad:function(){
        },
        onComplete:function(){
            $(this).colorbox.resize();
            var iPinId = $(this).parent().parent().attr('pin_id');
            $.ajax({ 
              url: 'service.php',
              data: 'get=comments&id=' + iPinId,
              cache: false, 
              success: function(html){
                $('.comments').append(html);

                $(this).colorbox.resize();
              } 
            });

        },
        onCleanup:function(){
        },
        onClosed:function(){
        }
    });
}

$(document).ready(function(){

    // file field change handler
    $('#image_file').change(function(){
        var file = this.files[0];
        name = file.name;
        size = file.size;
        type = file.type;

        // extra validation
        if (name && size)  {
            if (! file.type.match('image.*')) {
                alert("Select image please");
            } else {
                fileSelectHandler();
            }
        }
    });

    // masonry initialization
    var $container = $('.main_container');
    
    $container.imagesLoaded(function(){
      // options
      $container.masonry({
        itemSelector: '.pin',
        isAnimated: true,
        isFitWidth: true,
        isAnimatedFromBottom: true
      });
    });
    
    $container.infinitescroll({
      navSelector  : '#page-nav',    // selector for the paged navigation 
      nextSelector : '#page-nav a',  // selector for the NEXT link (to page 2)
      itemSelector : '.pin',     // selector for all items you'll retrieve
      loading: {
          finishedMsg: 'No more pages to load.'
        }
      },
      // trigger Masonry as a callback
      function( newElements ) {
        // hide new items while they are loading
        var $newElems = $( newElements ).css({ opacity: 0 });
        // ensure that images load before adding to masonry layout
        $newElems.imagesLoaded(function(){
          // show elems now they're ready
          $newElems.animate({ opacity: 1 });
          $container.masonry( 'appended', $newElems, true ); 

          // initiate colorbox
          initiateColorboxHandler();
        });
      }
    );

    // onclick event handler (for comments)
    $('.comment_tr').click(function () {
        $(this).toggleClass('disabled');
        $(this).parent().parent().parent().find('form.comment').slideToggle(400, function () {
            $('.main_container').masonry();
        });
    }); 

    // initiate colorbox
    initiateColorboxHandler();

    // onclick event handler (for like button)
    $('.pin .actions .likebutton').click(function () {
        $(this).attr('disabled', 'disabled');

        var iPinId = $(this).parent().parent().parent().attr('pin_id');
        $.ajax({ 
          url: 'service.php',
          type: 'POST',
          data: 'add=like&id=' + iPinId,
          cache: false, 
          success: function(res){
            $('.pin[pin_id='+iPinId+'] .info .LikesCount strong').text(res);
          } 
        });
        return false;
    }); 

    // onclick event handler (for repin button)
    $('.pin .actions .repinbutton').click(function () {
        var iPinId = $(this).parent().parent().parent().attr('pin_id');
        $.ajax({ 
          url: 'service.php',
          type: 'POST',
          data: 'add=repin&id=' + iPinId,
          cache: false, 
          success: function(res){
            window.location.href = 'profile.php?id=' + res;
          } 
        });
        return false;
    });
});