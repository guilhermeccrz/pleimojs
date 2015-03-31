$(function () {

    $.get(base_url+'application/www/language/settings.xml', null, function (data, textStatus) {
        
        if (textStatus == "success") language = data;     

    }, 'xml').done(function(){
        //check if support was previous loaded
        if(pleimo.settingsUpdate == 0){
            $('#form-settings').sayt({'recover': true});

            pleimo.settingsUpdate = 1;
            $('#form-settings').sayt({'erase': true});
        }

        $('#day-birthday').autotab({maxlength: 2, target: '#month-birthday'});
        $('#month-birthday').autotab({maxlength: 2, target: '#year-birthday'});
        $('#year-birthday').autotab({maxlength: 4});

        $('#ddi-cellphone').autotab({maxlength: 2, target: '#ddd-cellphone'});
        $('#ddd-cellphone').autotab({maxlength: 2, target: '#number-cellphone'});

        $(".button.supporter-select").click(function(){
            pleimo.Template.Support();
        });

        $("a.button.genders").click(function(){
            genders.edit();
        });

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
                else if(error[0].innerHTML != "")
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

    var genders = {
        "edit" : function() {
            $.ajax({
                type : "POST",
                url  : base_url+"genders",
                beforeSend : function() {
                    openMask();
                },
                success : function(data) {
                    $('body').append(data);
                }
            })
        }
    }

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
                        var states = $.parseJSON(states);

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
                    var cities = $.parseJSON(cities);

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

    }
    
 
});