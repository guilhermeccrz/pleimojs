$(function () {

    $.get(base_url+'application/www/language/register.xml', null, function (data, textStatus) {
        
        if (textStatus == "success") language = data;     

    }, 'xml').done(function(){

        $(document).on('change', '#haslabel', function()
        {
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
        });

        $("#form-register-artist").validate({

            errorElement: "span",

            rules : {
                name : {
                    required : true
                },
                country : {
                    required : false
                }
            },
            messages : {
                name : {
                    required : $(language).find('data text[id="form-register-artist-name-error"] '+lang).text()
                },
                country : {
                    required : $(language).find('data text[id="form-register-country-error"] '+lang).text()
                }
            },
            
            errorPlacement: function(error, element) {

                if (element.attr("id") == "terms") {
                    error.insertAfter($("form").find("#read-terms").after());
                    error.css('margin-left', '205px');
                }
                else {
                    error.insertAfter(element);
                }
                
            },
            
            success: function() {
                errors = false;
            },

            invalidHandler: function(form, validator) {
                errors = true;
            },

            submitHandler: function(form) {
                $("#form-register-artist .submit").addClass('load').trigger("click");
            }

        });
          
    });

    var label = {

        "haslabel" : function(value)
        {
            (value == "1") ? $("label[for=labelchoice]").show() : $("label[for=labelchoice]").hide();
        },

        "otherlabel" : function(value)
        {
            $('#labelchoice').val(value);
            (value == "others") ? $("label[for=nlabel]").show() : $("label[for=nlabel]").hide();
        }

    };

    var places = {
        "states": function(element){
            $.ajax({
                url: base_url+'xhr/states',
                type:"POST",
                data: ({'country' : $(element).data('idcountry')}),
                success: function(states)
                {
                    states = $.parseJSON(states);
                    $('label[for="state"] .dropdown').empty();
                    $.each(states, function(i, item)
                    {
                        $('label[for="state"] .dropdown').append('<li><a href="javascript:void(0);" data-target="state" data-id="' + item.CODE + '" data-idstate="' + item.ID_STATE + '">' + item.NAME + '</a></li>');
                    });
                }
            });
        },

        "cities": function(element){
            $.ajax({
                url: base_url+'xhr/cities',
                type:"POST",
                data: ({'state' : $(element).data('idstate')}),
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
            } else {
                $('label[for="'+stateField+'"]').hide();
                $('label[for="'+cityField+'"]').parent().removeClass().addClass('grid_6 prefix_3');
                $('#'+stateField).val('');
                $('#'+cityField).val('');
                if (stateField == 'userState') $('#cpf').removeClass('cpf');
            }

        }
    }

});