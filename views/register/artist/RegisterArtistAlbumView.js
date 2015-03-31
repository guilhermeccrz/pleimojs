define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone'),
        ContentFactory  = require('views/ContentFactory'),
        //template        = require('template'),
        UploadView      = require('views/ui/UploadView');

    require('validate');
    require('validatePleimo');
    require('swfobject');
    require('uploadify');
    require('select2');

    var viewFactory = new ContentFactory();
    var lang = window.lang;
    var base_url = window.base_url;
    var assets_url = window.assets_url;

    /**
     * Pleimo namespace
     * @namespace pleimo
     */
    var pleimo = window.pleimo || {};

    var tab               = null;
    var bytesUpload       = 0;
    var load = window.load || {};
    var members           = ('members' in load) ? load.members : [];
    var additionalArtists = null;

    pleimo.Register = {
        artist    : $("#artist").val(),
        albumsRef : null,
        totalSize : 0,
        init : function() {

            pleimo.Register.Album.create('active');

            if ($("#tabs").find('li').length == 1) pleimo.Register.Album.create();

            $(document).off(".reg-album")
                .on("click.reg-album", ".save.album", function(e) {
                    $(e.currentTarget).addClass('loading');
                    if ($("#"+$(this).data('id')+"-form").valid()) {
                        pleimo.Register.Album.save($(this), $(this).data('id'));
                    } else {
                        $(e.currentTarget).removeClass('loading');
                    }

                    e.stopImmediatePropagation();
                })
                .on("click.reg-album", "#tabs.list-album li", function() {
                    pleimo.Register.Album.change($(this));
                    if ($("#tabs").find('li').length < 7 && $(this).is(':last-child')) pleimo.Register.Album.create();
                })
                .on("click.reg-album", ".add-album figure", function(){
                    pleimo.Register.Album.picture($(this).find('img').attr('id'));
                })
                .on('click.reg-album', '.music.edit', function(){
                    $('.music.edit').val('');
                    $('.music.edit').addClass('wait');
                    pleimo.Register.Musics.saveEdit($(this).data('id'));
                })
                .on("click.reg-album", ".music.save", function() {

                    var validations = [];
                    var validated = [];

                    $(".musics.insert form").each(function() {
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
                        $(".register .error").remove();
                        $('.music.save').val('');
                        $('.music.save').addClass('wait');
                        pleimo.Register.Musics.save();
                    }

                    if (selectCont === ''){
                        $('.errorLabel').remove();
                        $('<span class="error errorLabel">'+$(pleimo.Language.Register).find('data text[id="form-register-album-label"] '+lang).text()+'</span>').insertAfter($(".select2-container"));

                    }

                    if ($("#music-rules:checked").length < 1)
                    {
                        $('.register span.error').remove();
                        $('<span class="error">'+$(pleimo.Language.Register).find('data text[id="form-register-album-copyright-error"] '+lang).text()+'</span>').insertAfter($("span.music-rules"));
                    }

                })
                .on('click.reg-album', ".btnInsert", function () {
                    pleimo.Register.Musics.create();
                })
                .on('click.reg-album', '#upload-musics', function () {
                    pleimo.Register.Musics.create();
                })
                .on('click.reg-album', "i.warning", function () {
                    pleimo.Register.Musics.remove($(this));
                })
                .on('change.reg-album', '#haslabel', function (){
                    var form = $(this).parent().parent().parent().parent();
                    pleimo.Register.Label.haslabel($(this).val(), form);
                })
                .on('click.reg-album', '.dropdown li a', function (){
                    var form = $(this).parent().parent().parent().parent().parent();
                    pleimo.Register.Label.nlabel($(this).data('id'), form);
                })
                .on("click.reg-album", "input[type='checkbox'].hide-adjacent-sibling", function() {
                    $(this).parent().next().toggle();
                })
                .on("click.reg-album","input[name='territory']", function(){
                    var valInput = $(this).val();
                    var valGlobal = $("input[name='territory']:eq(0)").prop('checked');

                    if(valInput == '1'){

                        $("input[name='territory']").each(function(){
                            $(this).prop('checked',true);
                        });

                        $("input[name='territory']:eq(0)").prop('checked',true);

                    } else{

                        if(valGlobal === true){
                            $("input[name='territory']:eq(0)").prop('checked',false);
                            $("input[name='territory']").each(function(){
                                $(this).prop('checked',false);
                            });
                            $(this).prop('checked',true);
                        }
                    }
                })
                .on("click.reg-album", ".additional-artist.delete", function() {

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
                .on("click.reg-album", ".additional-artist.add", function() {

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
                        console.log('remove');
                        $('.additional-artist-wrap:eq(4) button.additional-artist').removeClass('add').addClass('remove').addClass('delete');

                    }

                    return false;
                })
                .on('click.reg-album', '.actions-col .edit', function(e) {
                    pleimo.Register.Musics.load($(this).data('id'));
                    e.stopImmediatePropagation();
                })
                .on("click.reg-album", '.actions-col .remove', function(e) {
                    pleimo.Register.Musics.remove($(this).data('id'));
                    e.stopImmediatePropagation();
                })
                .on('change.reg-album', '.select-label', function(e){
                    var label = $(this).data('target');
                    var id = $(this).data('id');

                    $('#' + label).val(e.val);
                    pleimo.Register.Label.otherlabel(e.val, id);
                });
        },

        Album : {

            "create" : function(style) {

                var time = new Date().getTime();
                var defaultImage = assets_url+"images/bg-album-add.jpg";

                $("#tabs li img").each(function() {
                    if($(this).attr('src').indexOf('bg-album-add.jpg') != -1) $(this).attr('src', assets_url+'images/bg-album-default.jpg');
                });

                if ($("#tabs li").length >= 6)  defaultImage = assets_url+"images/bg-album-default.jpg";

                $("#tabs").append("<li class=\""+time+"\" data-tab=\""+time+"\"><figure><img src=\""+ defaultImage +"\" alt=\"\" /></figure></li>");

                if (style == "active") $("#form-albums").addClass('loading');

                $.ajax({
                    type : "POST",
                    url  : base_url+'register/album/album',
                    data : { album: time, artist : pleimo.Register.artist }
                }).done( function(data, status, response) {

                    $("#form-albums").removeClass('loading');

                    $("#form-albums").append(data);

                    if (style) $("li."+time).addClass('active').append("<i class=\"album-active\"></i>");
                    if (style) $("#"+time).show();

                    if ($('ul.list-album li[data-tab='+ time +']').hasClass('active'))
                        $("#"+time).show();

                    pleimo.Register.Album.formInit(time);

                    var uploadView = new UploadView();
                    uploadView.image();

                });
            },

            "save" : function(button, album) {

                var aritstsNames = [];

                $("input.additional-artist-name", $("#" + album)).each(function() {
                    aritstsNames.push($(this).val());
                });

                var territory = [];
                $("input[name='territory']:checked", $("#" + album)).each(function() {
                    territory.push($(this).val());
                });

                $.ajax({
                    type  : "POST",
                    url   : base_url+'register/album/save',
                    data  : { "albumId" : $("#"+album+"-id").val(), "artist" : pleimo.Register.artist, "image" : $("#"+album+"-img").val(), "name" : $("#"+album+"-name").val(), "year" : $("#"+album+"-year").val(), "album" : $("#"+album+"-id").val(), "language" : $("#"+album+"-language").val(),  "territory" : territory, "additional-artist" : aritstsNames, "copyright" : $("input#"+album+"-copyright").prop("checked"), "ringtone" : $("input#"+album+"-ringtone").prop("checked"), "producer" : $("#"+album+"-producer").val() }
                }).done(function(data, status, response){

                        if (response.status == 200)
                        {
                            $(button).hide();

                            data      = $.parseJSON(data);
                            pleimo.Register.albumsRef = data.id;

                            //var terms = $(pleimo.Language.Register).find('data text[id="form-register-music-terms"] '+lang).text();

                            bytesUpload                 = 0;
                            pleimo.Register.totalSize   = 0;

                            $(".suggestion").remove();

                            if (data.id) $("#"+album+"-id").val(pleimo.Register.albumsRef);

                            if ($("#"+album).find("table").length === 0) $("<fieldset class='form-album musics'><div class='grid_3'><hgroup><h3>"+$(pleimo.Language.Register).find('data text[id=\"form-register-musics\"] '+lang).text()+"</h3></hgroup><a href='javascript:void(0);' id='upload-musics'><div class='add-picture'><figure class='uploadMusics'></figure><span>"+$(pleimo.Language.Register).find('data text[id=\"form-register-add-music\"] '+lang).text()+"</span></div></a></div><div class='data grid_12'><hr class='clear'><table class=\"musics data\"><thead><tr><th class='name-col'>"+$(pleimo.Language.Register).find('data text[id=\"form-musics-table-name\"] '+lang).text()+"</th><th class='duration-col'>"+$(pleimo.Language.Register).find('data text[id=\"form-musics-table-duration\"] '+lang).text()+"</th><th class='price-col'>"+$(pleimo.Language.Register).find('data text[id=\"form-register-price\"] '+lang).text()+"</th><th class='actions-col'>"+$(pleimo.Language.Register).find('data text[id=\"form-musics-table-actions\"] '+lang).text()+"</th></tr><tr colspan='3'></tr></thead><tbody></tbody><table></div> </fieldset><hr class='clear'>").appendTo("#"+album);
                            if (data.additionalArtists) additionalArtists = data.additionalArtists;

                            pleimo.Register.Musics.create();
                        }

                    });
            },

            "picture" : function(target) {

                $('#img-'+target).val('');

                $('#'+target+' figure img').remove();
                $('#'+target).find('object').show().attr("style", "visibility: visible");

            },

            "change" : function(select) {

                tab = select.data("tab");
                pleimo.Register.albumsRef = $("#"+tab+"-id").val();

                $("#tabs li").removeClass('active').find("i").remove();
                $("li."+tab).addClass("active").append("<i class=\"album-active\"></i>");

                if ($("article#"+tab).length === 0)
                    $('#form-albums').addClass("loading");

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
                            required : $(pleimo.Language.Register).find('data text[id="form-register-album-name-error"] '+lang).text()
                        },
                        year : {
                            required  : $(pleimo.Language.Register).find('data text[id="form-register-album-year-error"] '+lang).text(),
                            minlength : $(pleimo.Language.Register).find('data text[id="form-register-album-year-error-length"] '+lang).text()
                        },
                        copyright : {
                            required : $(pleimo.Language.Register).find('data text[id="form-register-album-copyright-error"] '+lang).text()
                        },
                        territory: {
                            required: $(pleimo.Language.Register).find('data text[id="form-register-album-territory-error"] '+lang).text()
                        }
                    },

                    errorPlacement: function(error, element) {

                        if (element.hasClass("copyright")) {
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

            }
        },

        Musics : {

            "create" : function(){

                var terms = $(pleimo.Language.Register).find('data text[id="form-register-music-terms"] '+lang).text();

                window.openMask();
                $("body").append("<div class='musics insert container blackbox twentyfour columns'>" +
                    "<div class='main twelve columns omega alpha'>" +
                    "<hgroup>" +
                    "<h3>"+$(pleimo.Language.Register).find('data text[id="form-register-music-select"] '+lang).text()+"</h3>" +
                    "</hgroup>" +
                    "<div class='select'>" +
                    "<input type='file' id='musicfy' class='musicfy' />" +
                    "</div>" +
                    "<div class=\"fullProgress\">" +
                    "<div class=\"fullProgressBar\"></div>" +
                    "</div>" +
                    "</div>" +
                    "<div class='uploads twelve columns omega alpha'>" +
                    "<div id='fileQueue'>" +
                    "</div>" +
                    "<dl class='accordion'><div class='register'><span class=\"music-rules\"><input type='checkbox' name='music-rules' id='music-rules' class='copyright' /> <a href='" + base_url + "terms/artists' target='_blank'>"+terms+"</a><span> <input type=\"button\" class=\"music save button\" value=\""+$(pleimo.Language.Register).find('data text[id="form-button-save"] '+lang).text()+"\" /></div></dl> </div></div>");


                var uploadView = new UploadView();
                uploadView.music();
            },

            "save" : function () {

                var values = {};

                $('.accordion form').each(function(index, value) {
                    values[index] = $(this).serializeArray();
                });

//                $('.musics .music.save').val($(pleimo.Language.Register).find('data text[id="form-button-waiting"] '+lang).text());

                $.ajax({
                    type : "POST",
                    url  : base_url+'register/music/save',
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
                                $("<tr id=\""+value.ID_MUSIC+"\"><td class='name-col'>"+value.TITLE+"</td><td class='duration-col'>"+value.LENGTH+"</td><td class='price-col'>"+value.CURRENCY['CURRENCY']+' '+pleimo.Register.Actions.numberFormat(value.PRICE['PRICE'], 2, ',', '.')+"</td><td class='actions-col'><i class='edit' data-id=\""+value.ID_MUSIC+"\"></i><i class='remove' data-id=\""+value.ID_MUSIC+"\"></i></td></tr>").appendTo('table.musics tbody');
                            });

                            window.closeMask();
                        }

                    });

            },

            "load" : function(music) {

                $.ajax({
                    type  : "POST",
                    url   : base_url+'album/music',
                    data  : { music : music, artist : pleimo.Register.artist }
                }).done( function(data) {

                        var selectedMembers = '';
                        var selectedArtists = '';

                        window.openMask();

                        $("body").append(data);
                        $(".musics.insert .uploads").animate({ backgroundColor: "#e6e6e6" }, 300);
                        $(".musics.insert .uploads .accordion").show();

                        $('.members option:selected').each(function(index, value) {
                            if (($('.members option:selected').length-1) > index) {
                                selectedMembers += $(value).val()+',';
                            } else {
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
                    url  : base_url+'register/music/save_edit',
                    data : { music           : music,
                        name            : $('#'+music+'-name').val(),
                        lyrics          : $('#'+music+'-lyrics').val(),
                        songwriter      : $('#'+music+'-songwriter').val(),
                        haslabel        : $('input[name="haslabel"]:checked').val(),
                        label           : $('#'+music+'-label').val(),
                        nlabel          : $('#'+music+'-nlabel').val(),
                        price           : $('#'+music+'-price').val(),
                        isrc            : $('#'+music+'-isrc').val(),
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
                            $('tr[id='+music.ID_MUSIC+']').find('.price-col').empty().html(music.CURRENCY['CURRENCY']+' '+pleimo.Register.Actions.numberFormat(music.PRICE['PRICE'], 2, ',', '.'));
                            window.closeMask();
                        }
                    });
            },

            "edit" : function(target, title, album, file) {

                $("#"+target).addClass("loading");

                $.ajax({
                    type  : "POST",
                    url   : base_url+'register/album/music',
                    data  : { id : target, album : album, artist : pleimo.Register.artist, title: title, file: file }
                }).done( function(data) {

                        $("#"+target).removeClass("loading").append(data);

                        pleimo.Register.Musics.formInit(target);

                        var len = members.length;
                        for (var i=0; i<len; i++) {
                            $("#"+target).find(".members").append("<option value=\""+members[i].ID_ARTIST_MEMBER+"\">"+members[i].NAME+"</option>");
                        }

                    });
            },

            "remove" : function(music) {

                $.ajax({
                    type  : "POST",
                    url   : base_url+'register/music/delete',
                    data  : { "id" : music }
                }).done(function(data, status, response){

                        if (response.status == 200)
                        {
                            $(this).parent().parent().fadeOut("fast");

                            data = $.parseJSON(data);
                            if(data.status == 'success') $('tr#' + music).remove();
                        }

                    });

            },

            "formInit" : function(target) {

                $("#" + target + "-labels-select").select2({placeholder: $(pleimo.Language.Register).find('data text[id="form-register-choose-label"] '+lang).text(),  width:'365', minimumInputLength: 2 });

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
                        required : $(pleimo.Language.Register).find('data text[id="form-register-album-name-error"] '+lang).text()
                    }
                });

                $("#"+target+"-copyright").rules('add', {
                    required: {
                        depends : function (element) {
                            return ($(element).parent().parent().find('#haslabel:checked').val() === 0);
                        }
                    },
                    messages: {
                        required : $(pleimo.Language.Register).find('data text[id="form-register-album-copyright-error"] '+lang).text()
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

    };

    window.pleimo = pleimo;

    var RegisterArtistAlbumView = Backbone.View.extend({

        el: "#main",
        initialize: function(){

            //console.log('settings album');
            this.uploadView = new UploadView();

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
            //console.log('RegisterArtistAlbumView.addEvents');

            var that = this;

            $.get(base_url+'application/www/language/register.xml', null, function (data, textStatus) {

                if (textStatus == "success") {
                    pleimo.Language = {
                        Register : data
                    };

                    pleimo.Register.init();
                    that.uploadView.image();
                    that.uploadView.music();
                }

            }, 'xml');
        }

    });

    return RegisterArtistAlbumView;

});