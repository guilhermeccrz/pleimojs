define(function(require){
    "use strict";

    var $                    = require('jquery'),
        Backbone             = require('backbone'),
        ContentFactory       = require('views/ContentFactory');

        require('autoTab');
        require('jquery_mask');
        require('validate');
        require('validatePleimo');
        require('template');
        require('icheck');
        require('cookie');
        require('savetype');

    var pleimo = window.pleimo || {};
    var lang = window.lang;
    var base_url = window.base_url;

    var viewFactory = new ContentFactory();

    var ProfileView = Backbone.View.extend({
        el: "#main",
        template: '/profile',
        render: function(){
            var that = this;

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
        support: function() {
            viewFactory.createView('support');
        },

        genders: function() {
            viewFactory.createView('genders');
        },

        addMasks: function() {
            // masks
            $('.date').mask('11/11/1111');
            $('.time').mask('00:00:00');
            $('.date_time').mask('99/99/9999 00:00:00');
            $('.cep').mask('99999-999');
            $('.ddd').mask('99');
            $('.phone').mask('0{4,5}-0000', {
                reverse: true
            });
            $('.cellphone').mask('0{4,5}-0000', {
                reverse: true
            });
            $('.mixed').mask('AAA 000-S0S');

            $('.money').mask('000.000.000.000.000,00', {
                reverse: true
            });
            $('.ip_address').mask('0ZZ.0ZZ.0ZZ.0ZZ', {
                translation: {
                    'Z': "[0-9]?"
                }
            });
            $('.numeric').bind("keyup paste", function() {
                setTimeout(jQuery.proxy(function() {
                    this.val(this.val().replace(/[^0-9]/g, ''));
                }, $(this)), 0);
            });

            $('.form-select a').each(function() {
                var target = $(this).data('target') || '';
                if (target.length > 0) {
                    if ($("#" + target).is(":disabled")) {
                        $(this).removeClass("active").addClass("disabled");
                    }
                }
            });
        },

        addEvents: function() {
            this.addMasks();

            if(pleimo.settingsUpdate === 0){
                $('#form-settings').sayt({'recover': true});

                pleimo.settingsUpdate = 1;
                $('#form-settings').sayt({'erase': true});
            }

            $('.button.supporter-select').on('click', this.support);
            $('a.button.genders').on('click', this.genders);

            var errors;
            var that = this;

            var language = window.language || {};
            $.get(base_url+'application/www/language/settings.xml', null, function (data, textStatus) {

                if (textStatus == "success") language = data;

            }, 'xml').done(function(){

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

                    "hide" : function(element) {

                        if (element.data('id') === 1) {
                            $('label[for="state"]').show();
                            $('label[for="city"]').show();
                        } else {
                            $('label[for="state"]').hide();
                            $('label[for="city"]').hide();
                        }

                    }

                };

                //select current data
                var curCountryVal = $('#country').val();
                $("select.form-select").val(curCountryVal);

                //autotab
                $('#day-birthday').autotab({maxlength: 2, target: '#month-birthday'});
                $('#month-birthday').autotab({maxlength: 2, target: '#year-birthday'});
                $('#year-birthday').autotab({maxlength: 4});

                $('#ddi-cellphone').autotab({maxlength: 2, target: '#ddd-cellphone'});
                $('#ddd-cellphone').autotab({maxlength: 2, target: '#number-cellphone'});

                if (curCountryVal == 1) {
                    $('.cpf').mask('999.999.999-99', {
                        reverse: true
                    });
                    $('#zipcode').mask('99999-999');
                }

                /** form settings validate */
                $("#form-settings").validate({

                    errorElement: "span",

                    rules:{
                        name:{
                            required: true
                        },
                        lastname:{
                            required: true
                        },
                        cpf:{
                            required: {
                                depends : function (element) {
                                    return $('#country').val() == 1;
                                }
                            },
                            cpf: {
                                depends : function (element) {
                                    return $('#country').val() == 1;
                                }
                            }
                        },
                        gender:{
                            required: true
                        },
                        cpassword: {
                            equalTo: "#password"
                        }
                    },

                    messages:{
                        name:{
                            required: $(language).find('data text[id="settings-name-error"] '+lang).text()
                        },
                        lastname:{
                            required: $(language).find('data text[id="settings-lastname-error"] '+lang).text()
                        },
                        cpf:{
                            required: $(language).find('data text[id="settings-cpf-error"] '+lang).text()
                        },
                        gender:{
                            required: $(language).find('data text[id="settings-gender-error"] '+lang).text()
                        },
                        cpassword:{
                            equalTo: $(language).find('data text[id="settings-password-equal-error"] '+lang).text()
                        }
                    },

                    success: function() {
                        errors = false;
                    },

                    invalidHandler: function(form, validator) {
                        errors = true;
                    },

                    submitHandler: function(form) {
                        $("#form-settings .submit").data('callback', {
                            success: function(data){
                                if (data) {
                                    that.$el.html(data);
                                    that.addEvents();

                                    // UPDATE SESSION
                                    pleimo.Session.checkAuth();
                                }
                            }
                        });
                        $("#form-settings .submit").addClass('load').trigger("click");
                    },

                    errorPlacement: function(error, element) {

                        if (element.attr("type") == "hidden")
                        {
                            error.insertAfter(element.next());
                        }
                        else if (element.attr("class") == "ddi" || element.attr("class") == "ddd" || element.attr("class") == "cellphone")
                        {
                            error.insertAfter("#number-phone");
                        }
                        else if(element.attr("id") == "gender")
                        {
                            error.insertBefore(element.parents('ul'));
                        }
                        else if(error[0].innerHTML !== "")
                        {
                            error.insertAfter(element);
                        }

                    }

                });

                $(document).on('click', 'label[for="country"] .dropdown li a', function() {
                    places.hide($(this));
                    places.states($(this));
                });


            });

        }

    });

    return ProfileView;
});
