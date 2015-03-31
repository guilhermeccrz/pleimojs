$(function () {

    /**
     * Pleimo namespace
     * @namespace pleimo
     */
    var pleimo = window.pleimo || {};

    var tab = null;
    var bytesUpload = 0;
    var members = load.members;
    var additionalArtists = null;

    $.get(base_url+'application/www/language/register.xml', null, function (data, textStatus) {

        if (textStatus == "success") {
            pleimo.Language = {
                Edit : data
            }
        }

    }, 'xml')

    pleimo.Edit = {
        artist    : $("#artist").val(),
        albumId   : null,
        totalSize : 0,
        init : function () {
            pleimo.Edit.Album.load('active');
            if ($("#tabs").find('li').length == 1) pleimo.Edit.Album.create('active');

            $(document).on("click", ".edit-save.album", function(e) {
                if ($("#"+$(this).data('id')+"-form").valid()) pleimo.Edit.Album.save($(this), $(this).data('id'));
                e.stopImmediatePropagation();
            });

            $(document).on("click", ".edit.album", function(e) {
                if ($("#"+$(this).data('id')+"-form").valid()) pleimo.Edit.Album.saveEdit($(this).data('id'));
                e.stopImmediatePropagation();
            });

            $(document).on('click', '#read-terms', function(e) {

                openMask();
                e.preventDefault();

                $.ajax({
                    type : "GET",
                    url  : base_url+'terms/artists'
                }).done(function( data ) {

                    $("body").append("<div class='modal wrapper outbox'><button class=\"round-button close\"></button>"+$('.grid_18.main_full', data).html()+"<button class=\"round-button close\"></div>");

                });

            });

            $(document).on("click", "#tabs.list-album li", function() {
                pleimo.Edit.Album.change($(this));
                if ($("#tabs").find('li').length < 7 && $(this).is(':last-child')) pleimo.Edit.Album.create();
            });

            $(document).on("click", ".add-album figure", function(){
                pleimo.Edit.Album.edit($(this).find('img').attr('id'));
            });

            $(document).on("click", ".music.save", function() {

                var validations = new Array();
                var validated = new Array();

                $(".musics.insert form").each(function() {
                    validations.push($(this).attr('id'));
                });

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

                if ($.inArray(0, validated) === -1 && $("#music-rules:checked").length > 0)
                {
                    $(".register .error").remove();
                    $('.music.save').val('');
                    $('.music.save').addClass('wait');
                    pleimo.Edit.Musics.save();
                }

                if ($("#music-rules:checked").length < 1)
                {
                    $('<span class="error">'+$(pleimo.Language.Edit).find('data text[id="form-register-album-copyright-error"] '+lang).text()+'</span>').insertAfter($("span.music-rules"));
                }

            });

            $(document).on('click', '.music.edit', function(){
                $('.music.edit').val('');
                $('.music.edit').addClass('wait');
                pleimo.Edit.Musics.saveEdit($(this).data('id'));
            })

            $(document).on('click', ".btnInsert", function () {
                pleimo.Edit.Album.addMusic($(this).data('id'));
            });

            $(document).on('click', '#upload-musics', function () {
                pleimo.Edit.Album.addMusic($(this).data('id'));
            });

            $(document).on('click', "i.warning", function () {
                pleimo.Edit.Musics.remove($(this).data("id"));
                $(this).parent().parent().fadeOut("fast");
            });

            $(document).on('change', '#haslabel', function (){
                var form = $(this).parent().parent().parent().parent();
                pleimo.Edit.Label.haslabel($(this).val(), form);
            });

            $(document).on('click', '.dropdown li a', function (){
                var form = $(this).parent().parent().parent().parent().parent();
                pleimo.Edit.Label.nlabel($(this).data('id'), form);
            });

            $(document).on("click", "input[type='checkbox'].hide-adjacent-sibling", function() {
                $(this).parent().next().toggle();
            });

            $(document).on("click", ".additional-artist.delete", function() {

                $context = $(this).parent().parent();

                if ($('div.additional-artist-wrap', $context).length == 1) {
                    $("input[name='additional-artist-name']", $(this).parent()).val('');
                    $('div.additional-artist-wrap button.delete', $context).remove();
                }
                else {
                    $(this).parent().remove();
                    if ($('div.additional-artist-wrap', $context).length == 1) $('div.additional-artist-wrap', $context).append('<button class="round-button delete additional-artist"></button>');
                }

                return false;
            });

            $(document).on("click", ".additional-artist.add", function() {

                $context = $(this).parent().parent();

                if ($(this).parent().find('input[type="text"]').val() == "")
                {
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

                    $clone = $('div.additional-artist-wrap:first', $context).clone();
                    $("div.additional-artist-wrap:last", $context).after($clone);

                    $currentlyAdded = $('div.additional-artist-wrap:last', $context);
                    $($currentlyAdded).find('input').val('');

                    $('div.additional-artist-wrap .round-button', $context).removeClass('add').addClass('delete');
                    $currentlyAdded.find('.round-button').removeClass('delete').addClass('add');
                }

                return false
            });

            $(document).on('click', '.actions-col .edit', function() {
                pleimo.Edit.Musics.load($(this).data('id'));
            });

            $(document).on("click", '.actions-col .remove', function() {
                pleimo.Edit.Musics.remove($(this).data('id'));
            });

            $(document).on('change', '.select-label', function(e){
                label = $(this).data('target');
                id = $(this).data('id');

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
                })

                $("#tabs").append("<li class=\""+id_album+"\" data-tab=\""+id_album+"\"><figure><img src=\""+ defaultImage +"\" alt=\"\" /></figure></li>");

                $.ajax({
                    type : "POST",
                    url  : base_url+'artist/edit/albums/album',
                    data : { album: id_album, artist : pleimo.Edit.artist }
                }).done( function(data, status, response) {

                    $("#form-albums").append(data);

//                    if ($('ul.list-album li').length == 1) $("li."+id_album).addClass('active').append("<i class=\"album-active\"></i>");
//                    if ($('ul.list-album li').length == 1) $("#"+id_album).show();
                    if ($('ul.list-album li').length == 1) $('ul.list-album li:first').trigger("click");

                    pleimo.Edit.Album.formInit(id_album);

                });
            },

            "save" : function(button, album) {

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
                            if ($("#"+pleimo.Edit.albumId).find("table").length == 0) $("<fieldset class='form-album musics'><div class='grid_3'><hgroup><h3>"+$(pleimo.Language.Edit).find('data text[id=\"form-register-musics\"] '+lang).text()+"</h3></hgroup><a href='javascript:void(0);' id='upload-musics'><div class='add-picture'><figure class='uploadMusics'></figure><span>"+$(pleimo.Language.Edit).find('data text[id=\"form-register-add-music\"] '+lang).text()+"</span></div></a></div><div class='data grid_12'><hr class='clear'><table class=\"musics data\"><thead><tr><th class='name-col'>"+$(pleimo.Language.Edit).find('data text[id=\"form-musics-table-name\"] '+lang).text()+"</th><th class='duration-col'>"+$(pleimo.Language.Edit).find('data text[id=\"form-musics-table-duration\"] '+lang).text()+"</th><th class='price-col'>"+$(pleimo.Language.Edit).find('data text[id=\"form-register-price\"] '+lang).text()+"</th><th class='actions-col'>"+$(pleimo.Language.Edit).find('data text[id=\"form-musics-table-actions\"] '+lang).text()+"</th></tr><tr colspan='3'></tr></thead><tbody></tbody><table></div> </fieldset><hr class='clear'>").appendTo("#"+pleimo.Edit.albumId);
                            //if ( ! $("#"+album+"-img").val()) $("<span class='suggestion alert alert-warning'>"+$(language).find('data text[id="form-register-album-suggestion"] '+lang).text()+"</span>").insertAfter("#"+album+" fieldset");
                            if (data.additionalArtists) additionalArtists = data.additionalArtists;

                            openMask();
                            $("body").append("<div class='musics insert container blackbox twentyfour columns'> <div class='main twelve columns omega alpha'><hgroup><h3>"+$(pleimo.Language.Edit).find('data text[id="form-register-music-select"] '+lang).text()+"</h3></hgroup><div class='select'><input type='file' id='musicfy' class='musicfy' /></div><div class=\"fullProgress\"><div class=\"fullProgressBar\"></div></div></div> <div class='uploads twelve columns omega alpha'><div id='fileQueue'></div> <dl class='accordion'> <div class='register'><span class=\"music-rules\"><input type='checkbox' name='music-rules' id='music-rules' class='copyright' /> <a href='" + base_url + "'terms/artists' target='_blank'>"+ terms +"</a></span> <input type=\"button\" class=\"music save button\" value=\""+$(pleimo.Language.Edit).find('data text[id="form-button-save"] '+lang).text()+"\" /></div></dl> </div></div>");
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

                        if (response.status == 200)
                        {
                            data      = $.parseJSON(data);
                            pleimo.Edit.albumId = data.id;

                            var terms = $(pleimo.Language.Edit).find('data text[id="form-register-music-terms"] '+lang).text();

                            bytesUpload = 0;
                            pleimo.Edit.totalSize   = 0;

                            $(".suggestion").remove();

                            if ($("#"+album).find("table").length == 0) $("<fieldset class='form-album musics'><div class='grid_3'><hgroup><h3>"+$(pleimo.Language.Edit).find('data text[id=\"form-register-musics\"] '+lang).text()+"</h3></hgroup><a href='javascript:void(0);' id='upload-musics'><div class='add-picture'><figure class='uploadMusics'></figure><span>"+$(pleimo.Language.Edit).find('data text[id=\"form-register-add-music\"] '+lang).text()+"</span></div></a></div><div class='data grid_12'><hr class='clear'><table class=\"musics data\"><thead><tr><th class='name-col'>"+$(pleimo.Language.Edit).find('data text[id=\"form-musics-table-name\"] '+lang).text()+"</th><th class='duration-col'>"+$(pleimo.Language.Edit).find('data text[id=\"form-musics-table-duration\"] '+lang).text()+"</th><th class='price-col'>"+$(pleimo.Language.Edit).find('data text[id=\"form-register-price\"] '+lang).text()+"</th><th class='actions-col'>"+$(pleimo.Language.Edit).find('data text[id=\"form-musics-table-actions\"] '+lang).text()+"</th></tr><tr colspan='3'></tr></thead><tbody></tbody><table></div> </fieldset><hr class='clear'>").appendTo("#"+album);
                            //if ( ! $("#"+album+"-img").val()) $("<span class='suggestion alert alert-warning'>"+$(language).find('data text[id="form-register-album-suggestion"] '+lang).text()+"</span>").insertAfter("#"+album+" fieldset");
                            if (data.additionalArtists) additionalArtists = data.additionalArtists;

                            $('input.album.edit.button').after('<span class="album edited grid_8"><i class="check album edited"></i> Álbum editado com sucesso.</span>');
                        }

                    });
            },

            "edit" : function(target) {

                $('#img-'+target).val('');

                $('#'+target+' figure img').remove();
                $('#'+target).find('object').show().attr("style", "visibility: visible");

            },

            "change" : function(select) {

                tab = select.data("tab");
                pleimo.Edit.albumId = $("#"+tab+"-id").val();

                $("#tabs li").removeClass('active').find("i").remove();
                $("li."+tab).addClass("active").append("<i class=\"album-active\"></i>");

                $(".tab").hide();
                $("#"+tab).fadeIn("fast");

                return false;

            },

            "formInit" : function(target) {

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

                        if (element.hasClass("copyright")) {
                            error.insertAfter($("#"+target+"-form").find("#read-copyright").after());
                            error.css('margin-left', '5px');
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
                            })

                            if(index == (data.length - 1))
                            {
                                defaultImage = assets_url+'images/bg-album-default.jpg';
                            }

                            additionalArtists = $.parseJSON(value.participations);

                            if($("#tabs li").length > 6)  defaultImage = assets_url+"images/bg-album-default.jpg";

                            if (value.info.IMG_ALBUM != "undefined" && value.info.IMG_ALBUM != "" && value.info.IMG_ALBUM != null)
                            {
                                defaultImage = ('https:' == document.location.protocol ? 'https:' : 'http:')+"//pleimo-images.s3.amazonaws.com/album/200/"+value.info.IMG_ALBUM;
                            }

                            $("#tabs").append("<li class=\""+id_album+"\" data-tab=\""+id_album+"\"><figure><img src=\""+ defaultImage +"\" alt=\"\" /></figure></li>");

                            $("#form-albums").append(value.view);

                            if (index == 0)
                            {
                                if (style) $("li."+id_album).addClass('active').append("<i class=\"album-active\"></i>");
                                if (style) $("#"+id_album).show();
                            }
                        });
                        if (data.length < 7)
                        {
                            pleimo.Edit.Album.create();
                        }
                });


            },

            "addMusic" : function(){

                var terms = $(pleimo.Language.Edit).find('data text[id="form-register-music-terms"] '+lang).text();

                openMask();
                $("body").append("<div class='musics insert container blackbox twentyfour columns'> <div class='main twelve columns omega alpha'><hgroup><h3>"+$(pleimo.Language.Edit).find('data text[id="form-register-music-select"] '+lang).text()+"</h3></hgroup><div class='select'><input type='file' id='musicfy' class='musicfy' /></div><div class=\"fullProgress\"><div class=\"fullProgressBar\"></div></div></div> <div class='uploads twelve columns omega alpha'><div id='fileQueue'></div> <dl class='accordion'> <div class='register'><span class=\"music-rules\"><input type='checkbox' name='music-rules' id='music-rules' class='copyright' /> <a href='" + base_url + "'terms/artists' target='_blank'>" + terms + "</a></span> <input type=\"button\" class=\"music save button\" value=\""+$(pleimo.Language.Edit).find('data text[id="form-button-save"] '+lang).text()+"\" /></div></dl> </div></div>");
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

                            $(data).each(function(index, value) {
                              $("<tr id=\""+value.ID_MUSIC+"\"><td class='name-col'>"+value.TITLE+"</td><td class='duration-col'>"+value.LENGTH+"</td><td class='price-col'>"+value.CURRENCY['CURRENCY']+' '+pleimo.Edit.Actions.numberFormat(value.PRICE['PRICE'], 2, ',', '.')+"</td><td class='actions-col'><i class='edit' data-id='"+value.ID_MUSIC+"'></i><i class='remove' data-id='"+value.ID_MUSIC+"'></i></td></tr>").appendTo('table.musics tbody');
                            });

                            closeMask();
                        }

                    });
            },

            "edit" : function(target, title, album, file) {

                $.ajax({
                    type  : "POST",
                    url   : base_url+'register/album/music',
                    data  : { id : target, album : album, artist : pleimo.Edit.artist, title: title, file: file }
                }).done( function(data) {

                    $("#"+target).append(data);

                    pleimo.Edit.Musics.formInit(target);

                    for (i=0; i<members.length; i++) {
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
                        openMask();
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
                           closeMask();
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
                            return $(element).parent().parent().find('#haslabel:checked').val() == 0
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

                if (value == 0) $(parent).find('label.nlabel').hide();
            },

            "nlabel" : function(value, parent){
                (value == '-1') ? $(parent).find('label.nlabel').show() : $(parent).find('label.nlabel').hide();
            },

            "otherlabel" : function(value, target) {
                (value == "others") ? $("label[for=" + target + "-nlabel]").show() : $("label[for=" + target + "nlabel]").hide();
            }
        },

        Actions : {
            "numberFormat" :
                function number_format (number, decimals, dec_point, thousands_sep) {
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
    }

    pleimo.Edit.init();

    window.pleimo = pleimo;
});