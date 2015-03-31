define(function(require){
    "use strict";

    var $               = require('jquery'),
        _               = require('underscore'),
        Backbone        = require('backbone'),
        ContentFactory  = require('views/ContentFactory'),
        UploadView      = require('views/ui/UploadView');
        require('validate');
        require('validatePleimo');
        //template        = require('template'),


    require('select2');

    var base_url = window.base_url;
    var assets_url = window.assets_url;
    var lang = window.lang;

    switch (lang) {
        case 'pt-BR':
            require('select2_ptBR');
            break;
        case 'pt-PT':
        case 'fr-FR':
        case 'en-US':
            require('select2_enUS');
            break;
    }


    var viewFactory = new ContentFactory();

    /**
     * Pleimo namespace
     * @namespace pleimo
     */
    var pleimo = window.pleimo || {};

    var tab = null;
    var bytesUpload = 0;
    var load = window.load || {};
    var members = ('members' in load) ? load.members : [];
    var additionalArtists = null;

    pleimo.preventUploadAppend = 0;

    pleimo.Edit = {
        artist    : $("#artist").val(),
        albumId   : null,
        totalSize : 0,
        init : function () {
            pleimo.Edit.Album.load('active');

            $(document).off(".edit-album")
                .on("click.edit-album", ".edit-save.album", function(e) {
                    if ($("#"+$(this).data('id')+"-form").valid()) {
                        $(e.currentTarget).addClass('loading');
                        pleimo.Edit.Album.save($(this), $(this).data('id'));
                    } else {
                        $(e.currentTarget).removeClass('loading');
                    }

                    e.stopImmediatePropagation();
                })
                .on("click.edit-album", ".edit.album", function(e) {
                    $('span.album.edited').remove();
                    
                    if ($("#"+$(this).data('id')+"-form").valid()) {
                        $(e.currentTarget).addClass('loading');
                        $(e.currentTarget).attr("disabled", "disabled");
                        pleimo.Edit.Album.saveEdit($(this).data('id'));
                    } else {
                        $(e.currentTarget).removeClass('loading');
                        $(e.currentTarget).removeAttr("disabled");
                    }
                    e.stopImmediatePropagation();
                })
                .on('click.edit-album', '#read-terms', function(e) {
                    viewFactory.createView('termsArtist');
                })
                .on("click.edit-album", "#tabs.list-album li", function() {
                    pleimo.Edit.Album.change($(this));
                    if ($("#tabs").find('li').length < 7 && $(this).is(':last-child')) pleimo.Edit.Album.create();
                })
                .on("click.edit-album", ".add-album figure", function(){
                    console.log('edit');
                    pleimo.Edit.Album.edit($(this).closest('form').attr('id'));

                })
                .on("click.edit-album", ".music.save", function() {
                    var validations = [];
                    var validated = [];

                    $(".musics.insert form").each(function() {
                        console.log($(this).attr('id'));
                        validations.push($(this).attr('id'));
                    });

                    var errors = false;
                    var statusLabel = $('.fakeLabel .labeHas #haslabel').prop('checked');
                    var selectCont = $('.select2-container').prev('input').val();


                  //  console.log(statusLabel +' '+selectCont);

                    for (var i=0; i < validations.length; i++) {
                        if ($("#"+validations[i]).valid())
                        {
                            validated.push(1);
                        }else
                        {
                            var dd_id = validations[i].substr(0, 13);
                            $("#"+dd_id).show();
                            validated.push(0);
                        }
                    }

                    if(statusLabel === true && selectCont !== ''){
                        errors = true;
                    } else{
                        errors = false;

                        if(statusLabel === false){
                            errors = true;
                        }
                    }



                    if ($.inArray(0, validated) === -1 && $("#music-rules:checked").length > 0 && errors === true)
                    {
                        $(".register .error").remove();
                        $('.errorLabel').remove();
                        $('.music.save').val('');
                        $('.music.save').addClass('wait');
                        pleimo.Edit.Musics.save();
                    }

                    if (selectCont === ''){
                        $('.errorLabel').remove();
                        $('<span class="error errorLabel">'+$(pleimo.Language.Edit).find('data text[id="form-register-album-label"] '+lang).text()+'</span>').insertAfter($(".select2-container"));

                    }

                    if ($("#music-rules:checked").length < 1)
                    {
                        $('.register span.error').remove();
                        $('<span class="error">'+$(pleimo.Language.Edit).find('data text[id="form-register-album-copyright-error"] '+lang).text()+'</span>').insertAfter($("span.music-rules"));
                    }

                })
                .on('click.edit-album', '.music.edit', function(){
                    $('.music.edit').val('');
                    $('.music.edit').addClass('wait');
                    pleimo.Edit.Musics.saveEdit($(this).data('id'));
                })
                .on('click.edit-album', ".btnInsert", function () {
                    pleimo.Edit.Album.addMusic($(this).data('id'));
                })
                .on('click.edit-album', '#upload-musics', function () {
                    pleimo.Edit.Album.addMusic($(this).data('id'));
                })
                .on('click.edit-album', "i.warning", function () {
                    pleimo.Edit.Musics.remove($(this).data("id"));
                    $(this).parent().parent().fadeOut("fast");
                })
                .on('change.edit-album', '#haslabel', function (){
                    var form = $(this).parent().parent().parent().parent();
                    pleimo.Edit.Label.haslabel($(this).val(), form);
                })
                .on('click.edit-album', '.dropdown li a', function (){
                    var form = $(this).parent().parent().parent().parent().parent();
                    pleimo.Edit.Label.nlabel($(this).data('id'), form);
                })
                .on("click.edit-album", "input[type='checkbox'].hide-adjacent-sibling", function() {
                    $(this).parent().next().toggle();
                })
                .on("click.reg-album","input[name='territory']", function(){
                    var valInput = $(this).val();

                    if(valInput == '1'){
                        $("input[name='territory']").each(function(){
                           var valThis = $(this).val();
                           if(valThis !== '1'){$(this).prop('checked',true);}
                        });
                    } else{
                        $("input[name='territory']").each(function(){
                            var valThis = $(this).val();
                            if(valThis === '1'){$(this).prop('checked',false);}
                        });


                    }
                })
                .on("click.edit-album", ".additional-artist.delete", function() {

                    var $context = $(this).parent().parent();

                    if ($('div.additional-artist-wrap', $context).length == 1) {
                        $("input[name='additional-artist-name']", $(this).parent()).val('');
                        $('div.additional-artist-wrap button.delete', $context).remove();
                    }
                    else {


                        $(this).parent().remove();
                        if ($('div.additional-artist-wrap', $context).length == 1) $('div.additional-artist-wrap', $context).append('<button class="round-button delete additional-artist"></button>');

                        if ($('div.additional-artist-wrap', $context).length == 4) {
                            $('.additional-artist-wrap:eq(3) button.additional-artist').addClass('add').removeClass('remove').removeClass('delete');
                        }

                    }

                    return false;
                })
                .on("click.edit-album", ".additional-artist.add", function() {

                    var $context = $(this).parent().parent();

                    if ($(this).parent().find('input[type="text"]').val() === "") {
                        $(this).parent().find('input[type="text"]').addClass('error');
                        $(this).parent().find('button').after('<span class="error">'+$(pleimo.Language.Edit).find('data text[id="form-register-album-empty-participation"] '+lang).text()+'</span>');
                        return false;
                    }
                    $($context).find('span.error').remove();
                    $(this).parent().find('input[type="text"]').removeClass('error');



                    if ($("div.additional-artist-wrap", $context).length < 5) {



                        if ($('div.additional-artist-wrap:first button', $context).length == 2) {
                            $('div.additional-artist-wrap:first button.add', $context).remove();
                        }

                        var $clone = $('div.additional-artist-wrap:first', $context).clone();
                        $("div.additional-artist-wrap:last", $context).after($clone);

                        var $currentlyAdded = $('div.additional-artist-wrap:last', $context);
                        $($currentlyAdded).find('input').val('');

                        $('div.additional-artist-wrap .round-button', $context).removeClass('add').addClass('delete');
                        $currentlyAdded.find('.round-button').removeClass('delete').addClass('add');
                    }

                    if ($("div.additional-artist-wrap", $context).length == 5){
                        //console.log('remove');
                        $('.additional-artist-wrap:eq(4) button.additional-artist').removeClass('add').addClass('remove').addClass('delete');

                    }

                    return false;
                })
                .on('click.edit-album', '.actions-col .edit', function() {
                    pleimo.Edit.Musics.load($(this).data('id'));
                })
                .on("click.edit-album", '.actions-col .remove', function() {
                    pleimo.Edit.Musics.remove($(this).data('id'));
                })
                .on('change.edit-album', '.select-label', function(e){
                    var label = $(this).data('target');
                    var id = $(this).data('id');

                    $('#' + label).val(e.val);
                    pleimo.Edit.Label.otherlabel(e.val, id);
                });
        },

        Album : {

            "create" : function(style) {
                var id_album = new Date().getTime();
                var defaultImage = assets_url+"images/bg-album-add.jpg";

                $("#tabs li img").each(function() {
                    if($(this).attr('src').indexOf('bg-album-add.jpg') != -1) $(this).attr('src', assets_url+'images/bg-album-default.jpg');
                });

                $("#tabs").append('<li class="'+id_album+'" data-tab="'+id_album+'"><figure><img src="'+ defaultImage +'" alt="" /></figure></li>');

                if (style == "active") $("#form-albums").addClass('loading');

                $.ajax({
                    type : "POST",
                    url  : base_url+'artist/edit/albums/album',
                    data : { album: id_album, artist : pleimo.Edit.artist }
                }).done( function(data, status, response) {

                    $("#form-albums").removeClass('loading');

//                    if ($('ul.list-album li').length == 1) $("li."+id_album).addClass('active').append("<i class=\"album-active\"></i>");
//                    if ($('ul.list-album li').length == 1) $("#"+id_album).show();
                    //if ($('ul.list-album li').length == 1) $('ul.list-album li:first').trigger("click");
                    $("#form-albums").append(data);

                    if ($('ul.list-album li[data-tab='+ id_album +']').hasClass('active'))
                        $("#"+id_album).show();

                    if (style == "active")
                        pleimo.Edit.Album.change($('ul.list-album li[data-tab='+ id_album +']'));

                   // console.log(id_album);

                    pleimo.Edit.Album.formInit(id_album);

                   // var uploadView = new UploadView();
                  //  uploadView.image();
                });
            },

            "save" : function(button, album) {
                //console.log('savee');

                var aritstsNames = [];
                var territory = [];
                $("input.additional-artist-name", $("#" + album)).each(function() {
                    aritstsNames.push($(this).val());
                });

                $("input[name='territory']:checked", $("#" + album)).each(function() {
                    territory.push($(this).val());
                });

                $.ajax({
                    type  : "POST",
                    url   : base_url+'artist/edit/albums/save',
                    data  : { "artist" : pleimo.Edit.artist, "image" : $("#"+album+"-img").val(), "name" : $("#"+album+"-name").val(), "year" : $("#"+album+"-year").val(), "album" : $("#"+album+"-id").val(), "language" : $("#"+album+"-language").val(),  "territory" : territory, "additional-artist" : aritstsNames, "copyright" : $("input#"+album+"-copyright").prop("checked"), "ringtone" : $("input#"+album+"-ringtone").prop("checked"), "producer" : $("#"+album+"-producer").val(), "label" : $("#"+album+"-label").val(), "nlabel" : $("#"+album+"-nlabel").val()}
                }).done(function(data, status, response){

                        if (response.status == 200)
                        {
                            $(button).hide();

                            data      = $.parseJSON(data);
                            pleimo.Edit.albumId = data.id;
                            $('article:visible').attr('id', pleimo.Edit.albumId);

                            var terms = $(pleimo.Language.Edit).find('data text[id="form-register-music-terms"] '+lang).text();

                            bytesUpload = 0;
                            pleimo.Edit.totalSize   = 0;

                            $(".suggestion").remove();

                            if (data.id) $("#"+album+"-id").val(data.id);
                            if ($("#"+pleimo.Edit.albumId).find("table").length === 0) $("<fieldset class='form-album musics'><div class='grid_3'><hgroup><h3>"+$(pleimo.Language.Edit).find('data text[id=\"form-register-musics\"] '+lang).text()+"</h3></hgroup><a href='javascript:void(0);' id='upload-musics'><div class='add-picture'><figure class='uploadMusics'></figure><span>"+$(pleimo.Language.Edit).find('data text[id=\"form-register-add-music\"] '+lang).text()+"</span></div></a></div><div class='data grid_12'><hr class='clear'><table class=\"musics data\"><thead><tr><th class='name-col'>"+$(pleimo.Language.Edit).find('data text[id=\"form-musics-table-name\"] '+lang).text()+"</th><th class='duration-col'>"+$(pleimo.Language.Edit).find('data text[id=\"form-musics-table-duration\"] '+lang).text()+"</th><th class='price-col'>"+$(pleimo.Language.Edit).find('data text[id=\"form-register-price\"] '+lang).text()+"</th><th class='actions-col'>"+$(pleimo.Language.Edit).find('data text[id=\"form-musics-table-actions\"] '+lang).text()+"</th></tr><tr colspan='3'></tr></thead><tbody></tbody><table></div> </fieldset><hr class='clear'>").appendTo("#"+pleimo.Edit.albumId);
                            //if ( ! $("#"+album+"-img").val()) $("<span class='suggestion alert alert-warning'>"+$(language).find('data text[id="form-register-album-suggestion"] '+lang).text()+"</span>").insertAfter("#"+album+" fieldset");
                            if (data.additionalArtists) additionalArtists = data.additionalArtists;

                            window.openMask();
                            $("body").append("<div class='musics insert container blackbox twentyfour columns'> <div class='main twelve columns omega alpha'><hgroup><h3>"+$(pleimo.Language.Edit).find('data text[id="form-register-music-select"] '+lang).text()+"</h3></hgroup><div class='select'><input type='file' id='musicfy' class='musicfy' /></div><div class=\"fullProgress\"><div class=\"fullProgressBar\"></div></div></div> <div class='uploads twelve columns omega alpha'><div id='fileQueue'></div> <dl class='accordion'> <div class='register'><span class=\"music-rules\"><input type='checkbox' name='music-rules' id='music-rules' class='copyright' /> <a href='" + base_url + "terms/artists' target='_blank'>"+ terms +"</a></span> <input type=\"button\" class=\"music save button\" value=\""+$(pleimo.Language.Edit).find('data text[id="form-button-save"] '+lang).text()+"\" /></div></dl> </div></div>");

                            var uploadView = new UploadView();
                            uploadView.music();
                        }

                    });
            },

            "saveEdit" : function(album) {

                var aritstsNames = [];
                pleimo.Edit.albumId = album;
                var territory = [];
                $("input.additional-artist-name", $("#" + album)).each(function() {
                    aritstsNames.push($(this).val());
                });
                $("input[name='territory']:checked", $("#" + album)).each(function() {
                    territory.push($(this).val());
                });

                $.ajax({
                    type  : "POST",
                    url   : base_url+'artist/edit/albums/save',
                    data  : { "albumId" : album, "artist" : pleimo.Edit.artist, "image" : $("#"+album+"-img").val(), "name" : $("#"+album+"-name").val(), "year" : $("#"+album+"-year").val(), "album" : $("#"+album+"-id").val(), "language" : $("#"+album+"-language").val(),  "territory" : territory, "additional-artist" : aritstsNames, "ringtone" : $("input#"+album+"-ringtone").prop("checked"), "producer" : $("#"+album+"-producer").val(), "label" : $("#"+album+"-label").val(), "nlabel" : $("#"+album+"-nlabel").val()}
                }).done(function(data, status, response){
                    if (response.status == 200) {
                        data      = $.parseJSON(data);
                        pleimo.Edit.albumId = data.id;

                        //var terms = $(pleimo.Language.Edit).find('data text[id="form-register-music-terms"] '+lang).text();

                        bytesUpload = 0;
                        pleimo.Edit.totalSize   = 0;

                        $(".suggestion").remove();

                        if ($("#"+album).find("table").length === 0) $("<fieldset class='form-album musics'><div class='grid_3'><hgroup><h3>"+$(pleimo.Language.Edit).find('data text[id=\"form-register-musics\"] '+lang).text()+"</h3></hgroup><a href='javascript:void(0);' id='upload-musics'><div class='add-picture'><figure class='uploadMusics'></figure><span>"+$(pleimo.Language.Edit).find('data text[id=\"form-register-add-music\"] '+lang).text()+"</span></div></a></div><div class='data grid_12'><hr class='clear'><table class=\"musics data\"><thead><tr><th class='name-col'>"+$(pleimo.Language.Edit).find('data text[id=\"form-musics-table-name\"] '+lang).text()+"</th><th class='duration-col'>"+$(pleimo.Language.Edit).find('data text[id=\"form-musics-table-duration\"] '+lang).text()+"</th><th class='price-col'>"+$(pleimo.Language.Edit).find('data text[id=\"form-register-price\"] '+lang).text()+"</th><th class='actions-col'>"+$(pleimo.Language.Edit).find('data text[id=\"form-musics-table-actions\"] '+lang).text()+"</th></tr><tr colspan='3'></tr></thead><tbody></tbody><table></div> </fieldset><hr class='clear'>").appendTo("#"+album);
                        //if ( ! $("#"+album+"-img").val()) $("<span class='suggestion alert alert-warning'>"+$(language).find('data text[id="form-register-album-suggestion"] '+lang).text()+"</span>").insertAfter("#"+album+" fieldset");
                        if (data.additionalArtists) additionalArtists = data.additionalArtists;

                        $('input.album.edit.button').after('<span class="album edited grid_8"><i class="check album edited"></i> Álbum editado com sucesso.</span>');
                        setTimeout(function() {
                            $('span.album.edited').fadeOut("normal", function() {
                                $(this).remove();
                            });
                        }, 2000);

                        $('input.album.edit.button').removeClass('loading').removeAttr("disabled");
                    }
                });
            },

            "edit" : function(target) {

                $('#img-'+target).val('');

                $('#'+target+' figure img').remove();





                if($('#'+target).find('object').length){

                    $('#'+target).find('object').show().attr("style", "visibility: visible");

                }else{

                    console.log(target);
                    $('#'+target).find('.upload-cover').hide();
                    $('#'+target).find('.upload-cover').closest('figure').find('img').remove();

                    var uploadView = new UploadView();
                    uploadView.image();



                }

            },

            "change" : function(select) {

                tab = select.data("tab");
                pleimo.Edit.albumId = $("#"+tab+"-id").val();

                $("#tabs li").removeClass('active').find("i").remove();
                $("li."+tab).addClass("active").append("<i class=\"album-active\"></i>");

                $(".tab").hide();

                if ($("article#"+tab).length === 0)
                    $('#form-albums').addClass("loading");

                $("#"+tab).fadeIn("fast");

                return false;

            },

            "formInit" : function(target) {
            //console.log('validando');
                $("#"+target+"-form").validate({

                    errorElement : "span",

                    rules : {
                        name : {
                            required: true
                        },
                        year : {
                            minlength : 4,
                            required  : true
                        },
                        copyright : {
                            required : true
                        },
                        territory: {
                            required: true
                        }
                    },

                    messages : {
                        name : {
                            required : $(pleimo.Language.Edit).find('data text[id="form-register-album-name-error"] '+lang).text()
                        },
                        year : {
                            required  : $(pleimo.Language.Edit).find('data text[id="form-register-album-year-error"] '+lang).text(),
                            minlength : $(pleimo.Language.Edit).find('data text[id="form-register-album-year-error-length"] '+lang).text()
                        },
                        copyright : {
                            required : $(pleimo.Language.Edit).find('data text[id="form-register-album-copyright-error"] '+lang).text()
                        },
                        territory: {
                            required: $(pleimo.Language.Edit).find('data text[id="form-register-album-territory-error"] '+lang).text()
                        }
                    },

                    errorPlacement: function(error, element) {

                        if (element.hasClass("name")) {
                            error.insertAfter($("#"+target+"-form").find(".name").after());
                            error.css('padding-top', '5px');
                        } else if (element.hasClass("copyright")) {
                            error.insertAfter($("#"+target+"-form").find("#read-copyright").after());
                            error.css('margin-left', '5px');
                        }
                        else if (element.attr("id") == target + "-global") {
                            error.insertAfter($("#"+target+"-form").find("div.inputWrapper label").after());
                            error.css('margin-top', '5px');
                        }
                        else {
                            error.insertAfter(element);
                        }

                    }

                });
            },

            "load" : function(style) {
                $.ajax({
                    type : "POST",
                    url  : base_url+'artist/albums',
                    data : {artist: pleimo.Edit.artist}
                }).done( function(data, status, response) {
                    data = $.parseJSON(data);

                    $("#tabs").removeClass('loading');

                    $.each(data, function (index, value) {
                        var id_album = value.info.ID_ALBUM;
                        var defaultImage = assets_url+"images/bg-album-add.jpg";
                        $("#tabs li img").each(function() {
                            if($(this).attr('src').indexOf('bg-album-add.jpg') != -1) $(this).attr('src', assets_url+'images/bg-album-default.jpg');
                        });

                        if(index == (data.length - 1)) {
                            defaultImage = assets_url+'images/bg-album-default.jpg';
                        }

                        additionalArtists = $.parseJSON(value.participations);

                        if($("#tabs li").length > 6)  defaultImage = assets_url+"images/bg-album-default.jpg";

                        if ((typeof value.info.IMG_ALBUM != "undefined") && (value.info.IMG_ALBUM !== "") && (value.info.IMG_ALBUM != null)) {
                            defaultImage = ('https:' == document.location.protocol ? 'https:' : 'http:')+"//pleimo-images.s3.amazonaws.com/album/200/"+value.info.IMG_ALBUM;
                        }

                        $("#tabs").append("<li class=\""+id_album+"\" data-tab=\""+id_album+"\"><figure><img src=\""+ defaultImage +"\" alt=\"\" /></figure></li>");

                        $("#form-albums").append(value.view);

                        if (index === 0) {
                            if (style) {
                                $("li."+id_album).addClass('active').append("<i class=\"album-active\"></i>");
                                $("#"+id_album).show();
                            }
                        }

                        pleimo.Edit.Album.formInit(id_album);
                    });

                    if (data.length === 0) pleimo.Edit.Album.create('active');
                    if (data.length < 7)
                    {
                        pleimo.Edit.Album.create();
                    }
                });

            },

            "addMusic" : function(id){

                var terms = $(pleimo.Language.Edit).find('data text[id="form-register-music-terms"] '+lang).text();

                window.openMask();
                $("body").append("<div class='musics insert container blackbox twentyfour columns'> <div class='main twelve columns omega alpha'><hgroup><h3>"+$(pleimo.Language.Edit).find('data text[id="form-register-music-select"] '+lang).text()+"</h3></hgroup><div class='select'><input type='file' id='musicfy' class='musicfy' /></div><div class=\"fullProgress\"><div class=\"fullProgressBar\"></div></div></div> <div class='uploads twelve columns omega alpha'><div id='fileQueue'></div> <dl class='accordion'> <div class='register'><span class=\"music-rules\"><input type='checkbox' name='music-rules' id='music-rules' class='copyright' /> <a href='" + base_url + "terms/artists' target='_blank'>" + terms + "</a></span> <input type=\"button\" class=\"music save button\" value=\""+$(pleimo.Language.Edit).find('data text[id="form-button-save"] '+lang).text()+"\" /></div></dl> </div></div>");
                var uploadView = new UploadView();
                uploadView.music();
            }
        },

        Musics : {

            "save" : function () {

                var values = {};

                $('.accordion form').each(function(index, value) {
                    values[index] = $(this).serializeArray();
                });

//                $('.musics .music.save').val($(pleimo.Language.Edit).find('data text[id="form-button-waiting"] '+lang).text());

                $.ajax({
                    type : "POST",
                    url  : base_url+'artist/edit/music/save',
                    data : { "fields" : values },
                    error : function() {
                        $('.musics.blackbox').remove();
                        $.get(base_url+'application/www/views/500.tpl', { }, function( data ) {
                            $("body").append(data);
                        });
                    }
                }).done(function(data, status, response){

                        if (response.status == 200)
                        {
                            data = $.parseJSON(data);

                            var html = "";
                            $(data).each(function(index, value) {
                                html += "<tr id=\""+value.ID_MUSIC+"\"><td class='name-col'>"+value.TITLE+"</td><td class='duration-col'>"+value.LENGTH+"</td><td class='price-col'>"+value.CURRENCY['CURRENCY']+' '+pleimo.Edit.Actions.numberFormat(value.PRICE['PRICE'], 2, ',', '.')+"</td><td class='actions-col'><i class='edit' data-id='"+value.ID_MUSIC+"'></i><i class='remove' data-id='"+value.ID_MUSIC+"'></i></td></tr>";
                            });

                            $('table.musics tbody').append(html);

                            window.closeMask();
                        }

                    });
            },

            "edit" : function(target, title, album, file) {

                $("#"+target).addClass("loading");

                $.ajax({
                    type  : "POST",
                    url   : base_url+'register/album/music',
                    data  : { id : target, album : album, artist : pleimo.Edit.artist, title: title, file: file }
                }).done( function(data) {

                    $("#"+target).removeClass("loading").append(data);

                    pleimo.Edit.Musics.formInit(target);

                    var len = members.length;
                    for (var i=0; i<len; i++) {
                        $("#"+target).find(".members").append("<option value=\""+members[i].ID_ARTIST_MEMBER+"\">"+members[i].NAME+"</option>");
                    }

                });
            },


            "load" : function(music) {

                $.ajax({
                    type  : "POST",
                    url   : base_url+'album/music',
                    data  : { music : music, artist : pleimo.Edit.artist }
                }).done( function(data) {
                        var selectedMembers = '';
                        var selectedArtists = '';
                        window.openMask();
                        $("body").append(data);
                        $(".musics.insert .uploads").animate({ backgroundColor: "#e6e6e6" }, 300);
                        $(".musics.insert .uploads .accordion").show();
                        $('.members option:selected').each(function(index, value){
                            if (($('.members option:selected').length-1) > index){
                                selectedMembers += $(value).val()+',';
                            }else{
                                selectedMembers += $(value).val();
                            }
                        });
                        $('#'+music+'-selectedMembers').val(selectedMembers);
                        $('.artists option:selected').each(function(index, value){
                            if (($('.artists option:selected').length-1) > index){
                                selectedArtists += $(value).val()+',';
                            }else{
                                selectedArtists += $(value).val();
                            }
                        });
                        $('#'+music+'-selectedArtists').val(selectedArtists);

                        var uploadView = new UploadView();
                        uploadView.music();
                    });
            },

            "saveEdit" : function(music){
                $.ajax({
                    type : "POST",
                    url  : base_url+'artist/edit/music/edit',
                    data : { music           : music,
                        name            : $('#'+music+'-name').val(),
                        lyrics          : $('#'+music+'-lyrics').val(),
                        songwriter      : $('#'+music+'-songwriter').val(),
                        haslabel        : $('input[name="haslabel"]:checked').val(),
                        label           : $('#'+music+'-label').val(),
                        nlabel          : $('#'+music+'-nlabel').val(),
                        isrc            : $('#'+music+'-isrc').val(),
                        price           : $('#'+music+'-price').val(),
                        members         : $('#'+music+'-members').val(),
                        artists         : $('#'+music+'-artists').val(),
                        monetize        : $('input[name="'+music+'-monetize"]:checked').val(),
                        oldMonetize     : $('#oldMonetize').val(),
                        selectedMembers : $('#'+music+'-selectedMembers').val(),
                        selectedArtists : $('#'+music+'-selectedArtists').val() },
                    error : function() {
                        $('.musics.blackbox').remove();
                        $.get(base_url+'application/www/views/500.tpl', { }, function( data ) {
                            $("body").append(data);
                        });
                    }
                }).done(function(data, status, response){
                        if (response.status == 200){
                            music = $.parseJSON(data);
                            $('tr[id='+music.ID_MUSIC+']').find('.name-col').empty().html(music.TITLE);
                            $('tr[id='+music.ID_MUSIC+']').find('.price-col').empty().html(music.CURRENCY['CURRENCY']+' '+pleimo.Edit.Actions.numberFormat(music.PRICE['PRICE'], 2, ',', '.'));
                            window.closeMask();
                        }
                    });
            },

            "remove" :  function(music) {

                $.ajax({
                    type  : "POST",
                    url   : base_url+'artist/edit/music/delete',
                    data  : { "id" : music }
                }).done(function(data, status, response){

                        if (response.status == 200)
                        {
                            data = $.parseJSON(data);
                            if(data.status == 'success') $('tr#' + music).remove();
                        }

                    });

            },

            "formInit" : function(target) {

                $("#" + target + "-labels-select").select2({placeholder: $(pleimo.Language.Edit).find('data text[id="form-register-choose-label"] '+lang).text(),  width:'365', minimumInputLength: 2 });

                $("#"+target+"-music-upload").validate({

                    errorElement : "span",

                    errorPlacement: function(error, element) {

                        if (element.hasClass("copyright")) {
                            error.insertAfter($("#"+target+"-copyright").next());
                            error.css('margin-left', '5px');
                        }
                        else {
                            error.insertAfter(element);
                        }

                    }

                });

                $("#"+target+"-name").rules('add', {
                    required: true,
                    messages: {
                        required : $(pleimo.Language.Edit).find('data text[id="form-register-album-name-error"] '+lang).text()
                    }
                });

                $("#"+target+"-copyright").rules('add', {
                    required: {
                        depends : function (element) {
                            return ($(element).parent().parent().find('#haslabel:checked').val() === 0);
                        }
                    },
                    messages: {
                        required : $(pleimo.Language.Edit).find('data text[id="form-register-album-copyright-error"] '+lang).text()
                    }
                });

            }
        },

        Label : {
            "haslabel" : function(value, parent){
                if (value == 1)
                {
                    $(parent).find('label.label').show();
                    $(parent).find('label.music-copyright').hide();
                }else{
                    $(parent).find('label.label').hide();
                    $(parent).find('label.music-copyright').show();
                }

                if (value === 0) $(parent).find('label.nlabel').hide();
            },

            "nlabel" : function(value, parent){
                (value == '-1') ? $(parent).find('label.nlabel').show() : $(parent).find('label.nlabel').hide();
            },

            "otherlabel" : function(value, target) {
                (value == "others") ? $("label[for=" + target + "-nlabel]").show() : $("label[for=" + target + "nlabel]").hide();
            }
        },

        Actions : {
            "numberFormat" : function (number, decimals, dec_point, thousands_sep) {
                // From: http://phpjs.org/functions
                // Strip all characters but numerical ones.
                number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
                var n = !isFinite(+number) ? 0 : +number,
                    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
                    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
                    s = '',
                    toFixedFix = function (n, prec) {
                        var k = Math.pow(10, prec);
                        return '' + Math.round(n * k) / k;
                    };
                // Fix for IE parseFloat(0.55).toFixed(0) = 0;
                s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
                if (s[0].length > 3) {
                    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
                }
                if ((s[1] || '').length < prec) {
                    s[1] = s[1] || '';
                    s[1] += new Array(prec - s[1].length + 1).join('0');
                }
                return s.join(dec);
            }
        }
    };

    window.pleimo = pleimo;

    var RegisterArtistAlbumView = Backbone.View.extend({
        el: '#main',

        initialize: function(){
            //console.log('settings album');
        },

        render: function(){
            var that = this;

            this.template = location.pathname.substr(1);

            viewFactory.loadTemplate(this.template, {
                success: function(data, status) {
                    that.$el.html(data);
                    that.addEvents();
                },
                error: function(data, status) {
                    if (status == 404) {
                        that.$el.html(data);
                    }
                }
            }, { cache: false });
        },

        addEvents: function() {
            $.get(base_url+'application/www/language/register.xml', null, function (data, textStatus) {

                if (textStatus == "success") {
                    pleimo.Language = pleimo.Language || {};
                    _.extend(pleimo.Language, {
                        Edit : data
                    });

                    pleimo.Edit.init();
                }

            }, 'xml');
        }

    });

    return RegisterArtistAlbumView;

});