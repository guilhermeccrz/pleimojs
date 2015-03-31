$(function () {

    $.get(base_url+'application/www/language/register.xml', null, function (data, textStatus) {
        
        if (textStatus == "success") language = data;     

    }, 'xml').done(function(){

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
	        	$currentlyAdded = $('div.style:last');
	        	
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

                if (element.attr("id") == "terms") {
                    error.insertAfter($("form").find(".terms-artists").after());
                    error.css('margin-left', '205px');
                }
                else if (element.attr("id") == "email") {
                    error.insertAfter($("form").find("span.status").after());
                } else {
                    error.insertAfter(element);
                }
                
            },

            submitHandler: function(form) {
                $("#form-register-artist .submit").addClass('load').trigger("click");
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

    }

});