define(function(require){
    "use strict";

    //ar select2Locale_ = 'select2Locale_'+lang;

    var $               = require('jquery'),
        Backbone        = require('backbone'),
        ContentFactory  = require('views/ContentFactory');

    require('validate');
    require('validatePleimo');
    require('jquery_mask');
    //swfobject       = require('swfobject'),
    //uploadify       = require('uploadify'),
    require('select2');
    //template        = require('template');

    var viewFactory = new ContentFactory();
    var base_url = window.base_url;

    var RegisterArtistMainSettingsView = Backbone.View.extend({

        el: "#main",

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

        addMask: function() {
            $('.cpf').mask('999.999.999-99', {
                reverse: true
            });
        },
        addEvents: function() {
            this.addMask();

            var lang = window.lang || 'en-US';
            switch (lang) {
                case 'en-US':
                    $.extend($.fn.select2.defaults, {
                        formatMatches: function (matches) { return matches + " results are available, use up and down arrow keys to navigate."; },
                        formatNoMatches: function () { return "No matches found"; },
                        formatInputTooShort: function (input, min) { var n = min - input.length; return "Please enter " + n + " more character" + (n == 1 ? "" : "s"); },
                        formatInputTooLong: function (input, max) { var n = input.length - max; return "Please delete " + n + " character" + (n == 1 ? "" : "s"); },
                        formatSelectionTooBig: function (limit) { return "You can only select " + limit + " item" + (limit == 1 ? "" : "s"); },
                        formatLoadMore: function (pageNumber) { return "Loading more results…"; },
                        formatSearching: function () { return "Searching…"; }
                    });
                    break;

                case 'es-ES':
                    $.extend($.fn.select2.defaults, {
                        formatNoMatches: function () { return "No se encontraron resultados"; },
                        formatInputTooShort: function (input, min) { var n = min - input.length; return "Por favor, introduzca " + n + " car" + (n == 1? "ácter" : "acteres"); },
                        formatInputTooLong: function (input, max) { var n = input.length - max; return "Por favor, elimine " + n + " car" + (n == 1? "ácter" : "acteres"); },
                        formatSelectionTooBig: function (limit) { return "Sólo puede seleccionar " + limit + " elemento" + (limit == 1 ? "" : "s"); },
                        formatLoadMore: function (pageNumber) { return "Cargando más resultados…"; },
                        formatSearching: function () { return "Buscando…"; }
                    });
                    break;

                case 'fr-FR':
                    $.extend($.fn.select2.defaults, {
                        formatMatches: function (matches) { return matches + " résultats sont disponibles, utilisez les flèches haut et bas pour naviguer."; },
                        formatNoMatches: function () { return "Aucun résultat trouvé"; },
                        formatInputTooShort: function (input, min) { var n = min - input.length; return "Merci de saisir " + n + " caractère" + (n == 1 ? "" : "s") + " de plus"; },
                        formatInputTooLong: function (input, max) { var n = input.length - max; return "Merci de supprimer " + n + " caractère" + (n == 1 ? "" : "s"); },
                        formatSelectionTooBig: function (limit) { return "Vous pouvez seulement sélectionner " + limit + " élément" + (limit == 1 ? "" : "s"); },
                        formatLoadMore: function (pageNumber) { return "Chargement de résultats supplémentaires…"; },
                        formatSearching: function () { return "Recherche en cours…"; }
                    });
                    break;


                case 'it-IT':
                    $.extend($.fn.select2.defaults, {
                        formatNoMatches: function () { return "Nessuna corrispondenza trovata"; },
                        formatInputTooShort: function (input, min) { var n = min - input.length; return "Inserisci ancora " + n + " caratter" + (n == 1? "e" : "i"); },
                        formatInputTooLong: function (input, max) { var n = input.length - max; return "Inserisci " + n + " caratter" + (n == 1? "e" : "i") + " in meno"; },
                        formatSelectionTooBig: function (limit) { return "Puoi selezionare solo " + limit + " element" + (limit == 1 ? "o" : "i"); },
                        formatLoadMore: function (pageNumber) { return "Caricamento in corso…"; },
                        formatSearching: function () { return "Ricerca…"; }
                    });
                    break;


                case 'pt-BR':
                    $.extend($.fn.select2.defaults, {
                        formatNoMatches: function () { return "Nenhum resultado encontrado"; },
                        formatInputTooShort: function (input, min) { var n = min - input.length; return "Digite mais " + n + " caracter" + (n == 1? "" : "es"); },
                        formatInputTooLong: function (input, max) { var n = input.length - max; return "Apague " + n + " caracter" + (n == 1? "" : "es"); },
                        formatSelectionTooBig: function (limit) { return "Só é possível selecionar " + limit + " elemento" + (limit == 1 ? "" : "s"); },
                        formatLoadMore: function (pageNumber) { return "Carregando mais resultados…"; },
                        formatSearching: function () { return "Buscando…"; }
                    });
                    break;

                case 'pt-PT':
                    $.extend($.fn.select2.defaults, {
                        formatNoMatches: function () { return "Nenhum resultado encontrado"; },
                        formatInputTooShort: function (input, min) { var n = min - input.length; return "Digite mais " + n + " caracter" + (n == 1? "" : "es"); },
                        formatInputTooLong: function (input, max) { var n = input.length - max; return "Apague " + n + " caracter" + (n == 1? "" : "es"); },
                        formatSelectionTooBig: function (limit) { return "Só é possível selecionar " + limit + " elemento" + (limit == 1 ? "" : "s"); },
                        formatLoadMore: function (pageNumber) { return "Carregando mais resultados…"; },
                        formatSearching: function () { return "Buscando…"; }
                    });
                    break;
            }


            var language;
            $.get(base_url+'application/www/language/register.xml', null, function (data, textStatus) {

                if (textStatus == "success") language = data;

            }, 'xml').done(function(){


                $("#labels").select2({placeholder: $(language).find('data text[id="form-register-choose-label"] '+lang).text(),  width:'340', minimumInputLength: 2 }).select2("val", "");


                //console.log('lang '+language);

                $(document).on('change', '#haslabel', function() {
                    label.haslabel($(this).val());
                });

                $(document).on('change', '#labels', function(e)
                {
                    label.otherlabel(e.val);
                });

                $(document).on('click', 'label[for="userCountry"] .dropdown li a', function() {
                    places.hide($(this), 'userState', 'userCity');
                });

                $(document).on('click', 'label[for="country"] .dropdown li a', function() {
                    places.hide($(this), 'state', 'city');
                    places.states($(this));
                });

                $('#form-register-artist').on('click', '.add.style', function(e){

                    if ($('div.style').length < 5) {

                        $('div.style:eq(0)').clone().appendTo("label[for='style']");
                        var $currentlyAdded = $('div.style:last');

                        var time = new Date().getTime();
                        $('input[name="style[]"]', $currentlyAdded).attr('id', 'style-'+time);
                        $('.dropdown li a', $currentlyAdded).data('target', 'style-'+time);
                        $('.form-select a.active', $currentlyAdded).html('<span class="result">Escolha um Estilo</span><i class="select-arrow"></i>');

                        $('div.style .round-button').removeClass('add').addClass('delete');

                        if($('div.style').length < 5) $('.round-button', $currentlyAdded).removeClass('delete').addClass('add');

                    }

                    return false;

                });

                $('#form-register-artist').on('click', '.delete.style', function(e) {

                    $(this).parent().remove();
                    if ($('div.style').length < 5) $('div.style:last .round-button').removeClass('delete').addClass('add');

                });

                var errors = false;

                $("#form-register-artist").validate({
                    errorElement: "span",

                    rules : {
                        name : {
                            required : true
                        },
                        firstname : {
                            required : true
                        },
                        lastname : {
                            required : true
                        },
                        email : {
                            required : true,
                            email    : true
                        },
                        terms : {
                            required: true
                        },
                        cpf : {
                            required: {
                                depends : function (element) {
                                    return $('#userCountry').val() == 1;
                                }
                            }
                        }
                    },

                    messages : {
                        name : {
                            required : $(language).find('data text[id="form-register-artist-name-error"] '+lang).text()
                        },
                        firstname : {
                            required : $(language).find('data text[id="form-register-name-error"] '+lang).text()
                        },
                        lastname : {
                            required : $(language).find('data text[id="form-register-lastname-error"] '+lang).text()
                        },
                        cpf : {
                            required : $(language).find('data text[id="form-register-cpf-error"] '+lang).text()
                        },
                        email : {
                            required : $(language).find('data text[id="form-register-email-error"] '+lang).text(),
                            email    : $(language).find('data text[id="form-register-email-error-invalid"] '+lang).text()
                        },
                        terms: {
                            required : $(language).find('data text[id="form-register-terms-error"] '+lang).text()
                        }
                    },

                    errorPlacement: function(error, element) {

                        var statusLabel = $('.fakeLabel input:eq(0)').prop('checked');
                        var selectCont = $('#labelchoice').val();
                        if (element.attr("id") == "terms") {
                            error.insertAfter($("form").find(".terms-artists").after());
                            error.css('margin-left', '205px');
                        }
                        else if (element.attr("id") == "email") {
                            error.insertAfter($("form").find("span.status").after());
                        } else {
                            error.insertAfter(element);
                        }

                        if(statusLabel === true && selectCont !== ''){
                            errors = true;
                        } else{
                            errors = false;
                            if(statusLabel === false){ errors = true;}
                        }
                        if (selectCont === ''){
                            $('.errorLabel').remove();
                            $('<span class="errorLabel">'+$(language).find('data text[id="form-register-album-label"] '+lang).text()+'</span>').insertAfter($("#s2id_labels"));
                            $('.errorLabel').show();
                        }

                    },

                    submitHandler: function(form) {

                        var statusLabel = $('.fakeLabel input:eq(0)').prop('checked');
                        var selectCont = $('#labelchoice').val();

                        if(statusLabel === true && selectCont !== ''){
                            errors = true;
                        } else{
                            errors = false;
                            if(statusLabel === false){ errors = true;}
                        }

                        if (selectCont === ''){
                            $('.errorLabel').remove();
                            $('<span class="errorLabel">'+$(language).find('data text[id="form-register-album-label"] '+lang).text()+'</span>').insertAfter($("#s2id_labels"));
                            $('.errorLabel').show();
                        }

                        if(errors === true){
                            var $target = $("#form-register-artist .submit");
                            viewFactory.formSubmit($target);
                        } else{
                            return false;
                        }
                    }

                });

            });

            var label = {

                "haslabel" : function(value) {
                    (value == "1") ? $("label[for=labelchoice]").show() : $("label[for=labelchoice]").hide();
                },

                "otherlabel" : function(value) {
                    $('#labelchoice').val(value);
                    (value == "others") ? $("label[for=nlabel]").show() : $("label[for=nlabel]").hide();
                }

            };

            var places = {

                "states" : function(element) {

                    $("input#state").val('');

                    if ($(element).data('id') === 1)
                    {
                        $.ajax({
                            url: base_url+'xhr/states',
                            type:"POST",
                            data: ({'country' : $(element).data('id')}),
                            success: function(states)
                            {
                                states = $.parseJSON(states);

                                $('label[for="state"] .dropdown').empty();
                                $.each(states, function(i, item)
                                {
                                    $('label[for="state"] .dropdown').append('<li><a href="javascript:void(0);" data-target="state" data-id="' + item.ID_STATE + '">' + item.NAME + '</a></li>');
                                });
                            }
                        });
                    }

                },

                "cities" : function(element) {

                    $.ajax({
                        url  : base_url+'xhr/cities',
                        type :"POST",
                        data : ({'state' : $(element).data('id')}),
                        success: function(cities)
                        {
                            cities = $.parseJSON(cities);

                            $('label[for="city"] .dropdown').empty();
                            $.each(cities, function(i, item)
                            {
                                $('label[for="city"] .dropdown').append('<li><a href="javascript:void(0);" data-target="city" data-id="' + item.ID_CITY + '">' + item.NAME + '</a></li>');
                            });
                        }
                    });

                },

                "hide" : function(element, stateField, cityField) {

                    if (element.data('id') === 1) {
                        $('label[for="'+stateField+'"]').show();
                        $('label[for="'+cityField+'"]').parent().removeClass().addClass('grid_3');
                        $('#cpf').addClass('cpf').mask('999.999.999-99');
                    } else {
                        $('label[for="'+stateField+'"]').hide();
                        $('label[for="'+cityField+'"]').parent().removeClass().addClass('grid_6 prefix_3');
                        $('#'+stateField).val('');
                        $('#'+cityField).val('');
                        if (stateField == 'userState') $('#cpf').removeClass('cpf');
                    }

                }

            };

        }


    });

    return RegisterArtistMainSettingsView;
});