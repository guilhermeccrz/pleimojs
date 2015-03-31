define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone');
        require('template');
        require('swfobject');
        require('uploadify');

    var base_url = window.base_url;
    var lang = window.lang;

    var UploadView = Backbone.View.extend({


        initialize: function(type){
            //console.log('init');
        },

        image: function(reload){
            var cover = $(".upload-cover");



            //console.log('init image');
            cover.livequery(function(e) {

                if (!$(this).hasClass('initialized')) {
                    $(this).addClass('initialized');

                    var field = $(this).attr("id");

                    $(this).uploadify({
                        'uploader': base_url + 'templates/pleimo/javascript/libs/uploadify/uploadify.swf',
                        'cancelImg': base_url + 'templates/pleimo-s3/pleimo-assets/images/icon-cancel.png',
                        'script': base_url + 'upload/image',
                        'buttonImg': base_url + 'templates/pleimo-s3/pleimo-assets/images/bg-album-add.jpg',
                        'width': '160',
                        'height': '160',
                        'folder': '/temporary/',
                        'sizeLimit': '1073741824',
                        'simUploadLimit': '1',
                        'fileExt': '*.jpg;*.jpeg;*.gif;*.png;*.JPG;*.JPEG;*.GIF;*.PNG;',
                        'fileDesc': 'Image Files (.JPG, .JPEG, .GIF, .PNG)',
                        'multi': true,
                        'auto': true,
                        'removeCompleted': true,
                        'scriptAccess': 'always',

                        'onComplete': function(event, fileObj, data, response) {
                            var image = response;
                            var type = $("#" + field).data('type');
                            var sizes = JSON.parse("[" + $("#" + field).data('sizes') + "]");
                            var target = $("#" + field).data('target');
                            var ratio = $("#" + field).data('ratio');

                            /** make resize and send to S3 */
                            if (image) {
                                $.ajax({
                                    url: base_url + 'image/resize',
                                    type: "POST",
                                    data: ({
                                        'type': type,
                                        'image': image,
                                        'sizes': sizes,
                                        'aws': 'send',
                                        'ratio': ratio
                                    }),
                                    success: function(resize) {
                                        if (resize) {
                                            $("#" + target + "-img").val(image);

                                            $('#' + target).find('object').hide();
                                            $('#' + target + ' figure.album').append("<img id='" + target + "'src='" + ('https:' == document.location.protocol ? 'https:' : 'http:') + "//pleimo-images.s3.amazonaws.com/" + type + "/" + sizes[2] + "/" + resize + "' alt='' width='160' />");

                                            $('#tabs .' + target + ' figure').find('img').attr('src', ('https:' == document.location.protocol ? 'https:' : 'http:') + "//pleimo-images.s3.amazonaws.com/" + type + "/" + sizes[2] + "/" + resize).attr('width', '160');
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            });

        },


        music: function(){

            var pleimo = window.pleimo || {};

            //if(pleimo.preventUploadAppend === 0 ){
                //pleimo.preventUploadAppend = 1;

                $(".musicfy").livequery(function(e) {
                    if (!$(this).hasClass('initialized')) {
                        $(this).addClass('initialized');

                        var bytesUpload = 0;
                        var isEdit = (window.location.pathname.substr(0, 12) == '/artist/edit');
                        if (isEdit) pleimo.Edit.albumId = $('article:visible').attr('id');

                        $(this).uploadify({
                            'uploader': base_url + 'templates/pleimo/javascript/libs/uploadify/uploadify.swf',
                            'cancelImg': base_url + 'templates/pleimo-s3/pleimo-assets/images/icon-cancel.png',
                            'script': base_url + 'upload/image',
                            'buttonImg': base_url + 'templates/pleimo-s3/pleimo-assets/images/icon-upload.png',
                            'width': '73',
                            'height': '27',
                            'folder': '/temporary/',
                            'sizeLimit': '1073741824',
                            'simUploadLimit': '5',
                            'queueSizeLimit': '5',
                            'fileExt': '*.mp3;*.wav;*.MP3;*.WAV;',
                            'fileDesc': 'Music Files (.MP3, .WAV)',
                            'multi': true,
                            'auto': true,
                            'removeCompleted': false,
                            'scriptAccess': 'always',
                            'wmode': 'transparent',
                            'queueID': 'fileQueue',
                            'onSelect': function(event, id, file) {

                                if (isEdit) {
                                    pleimo.Edit.totalSize = 0;
                                    pleimo.Edit.totalSize += parseFloat(file.size);
                                } else {
                                    pleimo.Edit.totalSize = 0;
                                    pleimo.Register.totalSize += parseFloat(file.size);
                                }

                                if (isEdit) {
                                    $(".musics.insert h3").html($(pleimo.Language.Edit).find('data text[id="form-register-music-progress"] ' + lang).text());
                                } else {
                                    $(".musics.insert h3").html($(pleimo.Language.Register).find('data text[id="form-register-music-progress"] ' + lang).text());
                                }

                                $(".select").find('object').show().attr("style", "visibility: hidden");
                                $(".fullProgress").fadeIn("fast");

                            },
                            'onAllComplete': function(event, data) {

                                if (isEdit) {
                                    $(".musics.insert h3").html($(pleimo.Language.Edit).find('data text[id="form-register-music-success"] ' + lang).text());
                                } else {
                                    $(".musics.insert h3").html($(pleimo.Language.Register).find('data text[id="form-register-music-success"] ' + lang).text());
                                }

                                $(".musics.insert .uploads").animate({
                                    backgroundColor: "#e6e6e6"
                                }, 300);

                                $('.accordion > dd').hide();

                                $("#fileQueue").hide();
                                $('.accordion').show();

                                /** show the form of first music*/
                                $('.accordion').find('dd').first().show();
                            },
                            'onProgress': function(event, id, file, data) {

                                var progress;
                                if (isEdit) {
                                    progress = ((data.allBytesLoaded / pleimo.Edit.totalSize) * 100);
                                } else {
                                    progress = ((data.allBytesLoaded / pleimo.Register.totalSize) * 100);
                                }

                                $(".fullProgressBar").animate({
                                    'width': progress + "%"
                                }, 1).html(progress.toFixed(0) + "%");

                            },
                            'onComplete': function(event, file, data, response) {

                                bytesUpload += parseFloat(data.size);
                                if ((data.name).length > 55) data.name = (data.name).substr(0, 55) + "...";

                                var time = data.modificationDate.time;
                                $("<dt><a href=\"javascript:void(0);\">" + (parseFloat($(".musics.insert .accordion").find('dt').length) + 1) + ". " + data.name + "</a></dt><dd id='" + time + "'> </dd>").insertBefore(".musics.insert .accordion .register");

                                if (isEdit) {
                                    pleimo.Edit.Musics.edit(time, data.name, pleimo.Edit.albumId, response);
                                } else {
                                    pleimo.Register.Musics.edit(time, data.name, pleimo.Register.albumsRef, response);
                                }

                            }
                        });
                    }
                });

           // }

        }

    });

    return UploadView;
});
