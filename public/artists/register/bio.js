$(function () {

    var artist = $("#artist").val();

    var state = {
    	saving    : false,
    	uploading : false
    }

    $.get(base_url+'application/www/language/register.xml', null, function (data, textStatus) {

        if (textStatus == "success") language = data;

    }, 'xml').done(function(){

        $('#desc').keyup(function () {
            var max = 140;
            var len = $(this).val().length;

            if (len >= max) {
                $('#desc-count').text('Nenhum caracter restante.');
            } else {
                var char = max - len;
                $('#desc-count').text(char + ' caracteres restantes.');
            }
        });

        $(document).on("click", ".save.crew", function(e){
        	if ( ! state.saving && ! state.uploading) {

                state.saving = true;
        		save.crew(artist);

                $('.button.save').attr('disabled', 'disabled');
        	}
            e.stopImmediatePropagation();
        });

        $(document).on("click", ".save.photo", function(e){
            if ($('#img_photo').val() == "") {
                $('input.photo.button').after('<span class="error">Você precisa selecionar uma foto</span>');
                return false;
            }

            if ( ! state.saving && ! state.uploading) {

                state.saving = true;
                save.photo(artist);

                $('.button.save').attr('disabled', 'disabled');
            }
            e.stopImmediatePropagation();
        });

        $(document).on("click", ".save.video", function(e){
            if ( ! state.saving && ! state.uploading) {

                state.saving = true;
                save.video(artist, $("#video-input").val());

                $('.button.save').attr('disabled', 'disabled');
            }
            e.stopImmediatePropagation();
        });

        $(document).on("click", '.crew .add-picture figure', function(e){
            empty.image('crew');
            e.stopImmediatePropagation();
        });

        $(document).on("click", '.photo .add-picture figure', function(e){
            empty.image('photo');
            e.stopImmediatePropagation();
        });

        $(document).on("click", '.profile .add-picture figure', function(e){
            empty.image('profile');
            e.stopImmediatePropagation();
        });

        $(document).on("click", ".pictures.crew .delete", function(e){
            remove.crew($(this).parent().attr("id"));
            e.stopImmediatePropagation();
        });

        $(document).on("click", ".pictures.crew .edit", function(e){
            edit.crew($(this).parent().attr("id"));
            e.stopImmediatePropagation();
        });

        $(document).on("click", ".pictures.photo .delete", function(e){
            remove.photo($(this).parent().attr("id"));
            e.stopImmediatePropagation();
        });

        $(document).on("click", ".pictures.photo .edit", function(e){
            edit.photo($(this).parent().attr("id"));
            e.stopImmediatePropagation();
        });

        $(document).on("click", ".pictures.video .delete", function(e){
            remove.video($(this).parent().attr("id"));
            e.stopImmediatePropagation();
        });

        $(document).on("click", '.add.crew', function(e){
            $("#crew-upload").trigger("click");
            e.stopImmediatePropagation();
        });

        $(document).on('click', '.example-header', function(e) {

            openMask();
            e.preventDefault();

            $.get(base_url+'application/www/views/artists/register/example.tpl', function( data ) {
                $("body").append(data);
            });
            e.stopImmediatePropagation();
        });

        $(document).on('click', '.yt-view', function(e) {

            e.preventDefault();

            if (e.target.value.nodeName == "INPUT") {

                openMask();
                $.get(base_url+'application/www/views/artists/register/yt-player.php', { "API_ID" : $(this).closest("li").attr("id") }, function( data ) {
                    $("body").append(data);
                });

            }
            e.stopImmediatePropagation();
        });

        $(document).on('click', '.delete.style', function(e) {

            $(this).parent().remove();
            if($('div.style').length < 5) $('div.style:last .round-button').removeClass('delete').addClass('add');
            e.stopImmediatePropagation();
        });

        $(".upload").each(function() {

            var field = $(this).attr("id");

            $(this).uploadify({

                'uploader'        : base_url+'templates/pleimo/javascript/libs/uploadify/uploadify.swf',
                'cancelImg'       : base_url+'templates/pleimo-s3/pleimo-assets/images/icon-cancel.png',
                'script'          : base_url+'upload/image',
                'buttonImg'       : base_url+'templates/pleimo-s3/pleimo-assets/images/icon-register-logo-90-add.png',
                'width'           : '90',
                'height'          : '90',
                'folder'          : '/temporary/',
                'sizeLimit'       : '1073741824',
                'simUploadLimit'  : '100',
                'fileExt'         : '*.jpg;*.jpeg;*.gif;*.png;*.JPG;*.JPEG;*.GIF;*.PNG;',
                'fileDesc'        : 'Image Files (.JPG, .JPEG, .GIF, .PNG)',
                'multi'           : false,
                'auto'            : true,
                'removeCompleted' : true,
                'scriptAccess'    : 'always',
                'wmode'		      : 'transparent',

                'onSelect' : function(data) {
                	$('.button.save').attr('disabled', 'disabled');
                    state.uploading = true;
                },

                'onComplete' : function(event, fileObj, data, response)
                {
                    $('fieldset.photos').find('span.error').remove();

                    var image  = response;
                    var type   = $("#"+field).data('type');
                    var sizes  = JSON.parse("[" + $("#"+field).data('sizes') + "]");
                    var target = $("#"+field).data('target');
                    var ratio  = $("#"+field).data('ratio');

                    if (image)
                    {
                        $.ajax({
                            url  : base_url+'image/resize',
                            type : "POST",
                            data : ({'type' : type, 'image' : image, 'sizes' : sizes, 'aws' : 'send', 'ratio' : ratio}),
                            complete: function() { state.uploading = false; $('.button.save').removeAttr('disabled');},
                            success: function(resize)
                            {
                                if (resize)
                                {
                                    $('#img_'+target).val(image);

                                    $('.'+target+' .add-picture').find('object').hide();
                                    $('.'+target+' .add-picture figure').append("<img src='"+('https:' == document.location.protocol ? 'https:' : 'http:')+"//pleimo-images.s3.amazonaws.com/"+type+"/"+sizes[1]+"/"+resize+"' alt='' width='90' />");

                                    var picture = ('https:' == document.location.protocol ? 'https:' : 'http:')+"//pleimo-images.s3.amazonaws.com/"+type+"/"+sizes[1]+"/"+resize;
                                }
                            }
                        });
                    }
                    else {
                    	state.uploading = false;
                    	$('.button.save').attr('disabled', 'disabled');
                    }

                }

            });

        });

        $(document).on('click', '.add.style', function(e){

            if($('div.style').length < 5)
            {
                if($.find('.secondary-genre').length == 0) {
                    $('div.style').after('<span class="secondary-genre">' + $(language).find('data text[id="form-register-add-style"] '+lang).text() + '</span>');
                }

                $('div.style:eq(0)').clone().appendTo("label[for='style']");
                $currentlyAdded = $('div.style:last');

                var time = new Date().getTime();
                $('input[name="style[]"]', $currentlyAdded).attr('id', 'style-'+time);
                $('.dropdown li a', $currentlyAdded).data('target', 'style-'+time);
                $('.form-select a.active', $currentlyAdded).html('<span class="result">Escolha um Estilo</span><i class="select-arrow"></i>');

                $('div.style .round-button').removeClass('add').addClass('delete');

                if ($('div.style').length < 5) $('.round-button', $currentlyAdded).removeClass('delete').addClass('add');
            }

            return false;
            e.stopImmediatePropagation();
        });

        $("#header").uploadify({

            'uploader'        : base_url+'templates/pleimo/javascript/libs/uploadify/uploadify.swf',
            'cancelImg'       : base_url+'templates/pleimo-s3/pleimo-assets/images/icon-cancel.png',
            'script'          : base_url+'upload/image',
            'buttonImg'       : base_url+'templates/pleimo-s3/pleimo-assets/images/icon-upload.png',
            'width'           : '73',
            'height'          : '27',
            'folder'          : '/temporary/',
            'sizeLimit'       : '1073741824',
            'simUploadLimit'  : '100',
            'fileExt'         : '*.jpg;*.jpeg;*.gif;*.png;*.JPG;*.JPEG;*.GIF;*.PNG;',
            'fileDesc'        : 'Image Files (.JPG, .JPEG, .GIF, .PNG)',
            'multi'           : false,
            'auto'            : true,
            'removeCompleted' : true,
            'scriptAccess'    : 'always',

            'onSelect' : function(file) {
                $('div.header').find('object').attr("style", "visibility: hidden");
                $('div.header').find('.obs').hide();
            },

            'onCancel' : function(file) {
                $('div.header').find('object').attr("style", "visibility: visible");
                $('div.header').find('.obs').show();
            },

            'onComplete' : function(event, fileObj, data, response)
            {
                var header = response;

                $.ajax({
                    url: base_url+'image/send',
                    type:"POST",
                    data: ({'type' : "header", 'image' : header}),
                    success: function(send)
                    {
                        if (send)
                        {
                            $('#img_header').val(header);

                            $('div.header').find('object').hide();
                            $('div.header').append("<ul><li class='okay'><a href='"+('https:' == document.location.protocol ? 'https:' : 'http:')+"//pleimo-images.s3.amazonaws.com/header/"+send+"' class='popup'><figure><img src='"+('https:' == document.location.protocol ? 'https:' : 'http:')+"//pleimo-images.s3.amazonaws.com/header/"+send+"' class='header thumb'></figure></a></li><input class='button change' value='"+$(language).find('data text[id="form-register-header-change"] '+lang).text()+"' />");

                            $(document).on("click", 'input.change', function(){

                                $('#img_header').val('');

                                $('div.header').find('ul').remove();
                                $('div.header').find('object').show().attr("style", "visibility: visible");
                                $('div.header').find('.obs').show();

                            });
                        }
                    }
                });
            },

            'onUploadError' : function(file, errorCode, errorMsg, errorString) {
                $('label.header').find('object').attr("style", "visibility: visible");
                $('label.header').find('.obs').show();
            }

        });

        $("#form-step2").validate({

            success: function() {
                errors = false;
            },

            invalidHandler: function(form, validator) {
                errors = true;
            },

            submitHandler: function(form) {
                $("#form-step2 .submit").addClass('load').trigger("click");
            }

        });

    });

    var empty = {

        "image" : function(target) {

            $('#img_'+target).val('');
            $('.'+target+' .add-picture figure img').remove();
            $('.'+target+' .add-picture').find('object').show().attr("style", "visibility: visible");

        },

        "fields" : function(target)
        {
            $(target).find('input[type=text]').val('');
            $(target).find('textarea').val('').html('');
        }

    }

    var save = {

        "bio" : function(id) {

            $.ajax({
                type  : "POST",
                url   : base_url+'complete/artist/bio/save',
                data  : { "bio": $("#bio").val(), "id": id, 'favorite-bands' : $("#favorite-bands").val()}
            }).done(function(data, status, response){

                if (response.status == 200)
                {
                    $(".save.bio").parent().find(".success").remove();
                    $("<span class='success'>"+$(language).find('data text[id="form-register-bio-success"] '+lang).text()+" <i class='check'></i></span>").insertBefore(".save.bio");
                }

            });

        },

        "crew" : function(id) {

            if ($("#crew-name").val() && $("#crew-name").val())
            {
                $("input").removeClass("error");

                $.ajax({
                    type  : "POST",
                    url   : base_url+'register/crew/save',
                    data  : { "id" : id, "image" : $("#img_crew").val(), "name" : $("#crew-name").val(), "job" : $("#crew-job").val(), "twitter" : $("#crew-twitter").val(), "member" : $("#crew-id").val(), "facebook" : $("#crew-facebook").val() }
                }).done(function(data, status, response){

                    if (response.status == 200)
                    {
                        empty.image('crew');
                        empty.fields('.members');

                        data = $.parseJSON(data);

                        if ($("#crew-id").val()) $("#"+data.id).remove();

                        /** clean after edit */
                        $("#crew-id").val('');

                        var picture = "http://pleimo-images.s3.amazonaws.com/user/180/"+data.image+"";
                        if ( ! data.image) picture = assets_url+"images/bg-artist-default.jpg";

                        $(".pictures.crew").find("span").hide();

                        if($(".pictures.crew li").not('[id]').length != 0) {
                        	$(".pictures.crew li").not('[id]').remove();
                        }

                        $(".pictures.crew").append("<li id=\""+data.id+"\"><figure><img src=\""+picture+"\" alt=\"\" widht=\"130\" /></figure></li>")
                        $("#"+data.id).append("<input type=\"button\" class=\"edit button\" value=\""+$(language).find('data text[id="form-button-edit"] '+lang).text()+"\" />");
                        $("#"+data.id).append("<input type=\"button\" class=\"delete button gray\" value=\""+$(language).find('data text[id="form-button-delete"] '+lang).text()+"\" />");

                        if (($(".pictures.crew").find('li').length % 3) == 0) $("#"+data.id).addClass('last');

                        $(".pictures.crew .edit-overlay").remove();
                    }
                    state.saving = false;
                    $('.button.save').removeAttr('disabled');
                });
            }
            else
            {
                if ( ! $("#crew-name").val()) $("#crew-name").addClass('error');
                if ( ! $("#crew-job").val()) $("#crew-job").addClass('error');

                state.saving = false;
                $('.button.save').removeAttr('disabled');
            }

        },

        "photo" : function(id) {

          	if($("#img_photo").val() != '')
        	{
	            $.ajax({
	                type  : "POST",
	                url   : base_url+'register/photo/save',
	                data  : { "id" : id, "image" : $("#img_photo").val(), "subtitle" : $("#photo-subtitle").val(), "photo-id" : $("#photo-id").val() }
	            }).done(function(data, status, response){

	                if (response.status == 200)
	                {
	                    empty.image('photo');
	                    empty.fields('.photos');

	                    data = $.parseJSON(data);

	                    var picture = ('https:' == document.location.protocol ? 'https:' : 'http:')+"//pleimo-images.s3.amazonaws.com/photo/160/"+data.image+"";
	                    if ( ! data.image) picture = assets_url+"images/bg-photo-default.jpg";

                        var photoId = $('#photo-id').val();

                        if(photoId) {
                            $(".pictures.photo li#"+photoId+" img").attr('src', picture);
                        }
                        else
                        {
                            if($(".pictures.photo li").not('[id]').length == 0) {
                                if($(".pictures.photo li").length == 0) $(".pictures.photo").empty();
                                $(".pictures.photo").append("<li><figure><img src=\""+picture+"\" alt=\"\" widht=\"130\" /></figure></li>");
                                if (($(".pictures.photo li").length % 3) == 0) $(".pictures.photo li").last().addClass('last');
                            } else {
                                $(".pictures.photo li").not('[id]').find("img").attr('src', picture);
                            }
                        }

                        $("#photo-id").val('');
	                    $(".pictures.photo").find("span").hide();

	                    if($(".pictures.photo li").not('[id]').length != 0) {
		                    $(".pictures.photo li").not('[id]').attr('id', data.id);

		                    $("#"+data.id).append("<input type=\"button\" class=\"edit button\" value=\""+$(language).find('data text[id="form-button-edit"] '+lang).text()+"\" />");
		                    $("#"+data.id).append("<input type=\"button\" class=\"delete button gray\" value=\""+$(language).find('data text[id="form-button-delete"] '+lang).text()+"\" />");
	                	}

	                    $(".photos .edit-overlay").remove();
	                }

	                $('.button.save').removeAttr('disabled');
                    state.saving = false;
	            });
        	}

        },

        "video": function(artist, url){

            var arrayUrl = url.split("=");
            var id       = arrayUrl[1];

            var thumbnailUrl = 'http://img.youtube.com/vi/' + id + '/default.jpg';

            $('div.video span.error').remove();

            if ($('#video-input').val() == "") {
                $("#video-input").after("<span class=\"error\">Você precisa selecionar um vídeo</span>");

                state.saving = false;
                $('.button.save').removeAttr('disabled');

                return false;
            }

            if ($('ul.pictures.video').find('li[id="'+id+'"]').length > 0)
            {
                $("#video-input").after("<span class=\"error\">Este vídeo já foi adicionado.</span>");

                state.saving = false;
                $('.button.save').removeAttr('disabled');

                return false;
            }

            $.ajax({
                type: "POST",
                url : base_url+'register/video/save',
                data:{"artist" : artist, "url": id }
            }).done(function(data, status, response){

                if (response.status == 200)
                {
                    data = $.parseJSON(data);

                    if (data)
                    {
                        $(".videos").find(".error").remove();

                        empty.fields(".videos");

                        if($(".pictures.video li").length == 0) $(".pictures.video").empty();
                        $(".pictures.video").append('<li class="yt-view"><figure><img src="' + thumbnailUrl + '" /></figure></li>');
                        if (($(".pictures.video li").length % 3) == 0) $(".pictures.video li").last().addClass('last');

                        if($(".pictures.video li").not('[id]').length != 0) {
                            $(".pictures.video li").not('[id]').attr('id', data.API_ID);

                            $("#"+data.API_ID).append("<input type=\"button\" class=\"delete button delete-full gray\" value=\""+$(language).find('data text[id="form-button-delete"] '+lang).text()+"\" />");
                        }
                    } else {

                        $("#video-input").after("<span class=\"error\">A URL é inválida.</span>");

                    }

                    state.saving = false;
                    $('.button.save').removeAttr('disabled');
                }

            });

        }

    }

    var remove = {

        "crew" :  function(crew) {

            $.ajax({
                type  : "POST",
                url   : base_url+'register/crew/delete',
                data  : { "id" : crew, "image" : $("#"+crew).find('img').attr('src') }
            }).done(function(data, status, response){

                if (response.status == 200)
                {
                    $("#"+crew).remove();
                    if ($(".pictures.crew").find('li').length == 0) $(".pictures.crew").find("span").show();
                }

            });

        },

        "photo" :  function(photo) {

            $.ajax({
                type  : "POST",
                url   : base_url+'register/photo/delete',
                data  : { "id" : photo, "image" : $("#"+photo).find('img').attr('src') }
            }).done(function(data, status, response){

                if (response.status == 200)
                {
                	$(".photos .edit-overlay").remove();
                    $("#"+photo).remove();

                    $('.pictures.photo').find('.last').removeClass('last');
                    $('.pictures.photo li').each(function(index){
                        if (index % 3 == 2){
                            $(this).addClass('last');
                        }
                    });

                    if ($(".pictures.photo").find('li').length == 0) $(".pictures.photo").find("span").show();
                }

            });

        },

        "video" : function(video) {
        	$.ajax({
                type  : "POST",
                url   : base_url+'register/video/delete',
                data  : { "id" : video }
            }).done(function(data, status, response){

                if (response.status == 200)
                {
                    $(".photos .edit-overlay").remove();
                    $("#"+video).remove();

                    $('.pictures.video').find('.last').removeClass('last');
                    $('.pictures.video li').each(function(index){
                        if (index % 3 == 2){
                            $(this).addClass('last');
                        }
                    });
                }

            });
        }

    }

    var edit = {

        "crew" :  function(crew) {

            $.ajax({
                type  : "POST",
                url   : base_url+'register/crew/edit',
                data  : { "id" : crew }
            }).done(function(data, status, response){

                if (response.status == 200)
                {
                    data = $.parseJSON(data);

                    $(".members .edit-overlay").remove();

                    $("#"+crew).append("<div class=\"edit-overlay\"></div>");

                    $("#crew-id").val(data.ID_ARTIST_MEMBER);
                    $("#crew-name").val(data.NAME);
                    $("#crew-job").val(data.FUNCTION);
                    $("#crew-twitter").val(data.SOCIAL_TWITTER);
                    $("#crew-facebook").val(data.SOCIAL_FACEBOOK);
                    $("#img_crew").val(data.IMG_MEMBER);
                    $("#img_url").val(data.IMG_URL);

                    $('.crew .add-picture').find('object').hide();
                    $('.crew .add-picture figure img').remove();
                    $('.crew .add-picture figure').append("<img src='"+data.FULL_URL+"' alt='' width='90' height='90' />");
                }

            });

        },

        "photo" :  function(photo) {

            $.ajax({
                type  : "POST",
                url   : base_url+'register/photo/edit',
                data  : { "id" : photo }
            }).done(function(data, status, response){

                if (response.status == 200)
                {
                    data = $.parseJSON(data);

                    $(".photos .edit-overlay").remove();

                    $("#"+photo).append("<div class=\"edit-overlay\"></div>");

                    $("#photo-subtitle").val(data.SUBTITLE);
                    $("#photo-id").val(data.ID_ARTIST_PICTURE);
                    $("#img_photo").val(data.IMG);
                    $("#img_url").val(data.IMG_URL);

                    $('.photo .add-picture').find('object').hide();
                    $('.photo .add-picture figure img').remove();
                    $('.photo .add-picture figure').append("<img src='"+data.FULL_URL+"' alt='' width='90' height='90' />");
                }

            });

        }

    }

});