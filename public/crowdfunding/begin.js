$(function () {

    var pleimo = window.pleimo || {};

    $.get(base_url+'application/www/language/crowd.xml', null, function (data, textStatus) {

        if (textStatus == "success") {
            pleimo.Language = {
                Crowdfunding : data
            };
        }

    }, 'xml').done(function(){

        if (window.location.search == "")
        {
            pleimo.Crowd.Init();

            $(document).on("modalReady", function(){
                pleimo.Crowd.Open(pleimo.Crowd.Modal.begin);
            });
        }

        $(document).on('click', '.crowd-oauth', function(e) {
            pleimo.Crowd.Signin();
        });

        $(document).on('click', '.continue', function(e) {
            self.location = base_url;
        });

        $(document).on('click', 'button.close', function(e){
            closeMask();
        });

        $(document).on('click', '.crowd-modal li.facebook a.facebook', function(e){
            pleimo.Crowd.Facebook();
        });

    });

    /**
     * @author Leonardo Moreira <developer@pleimo.com>
     * @type {{Open: Function}}
     */
    pleimo.Crowd = {

        "Modal" : {
            begin : null,
            payment : null,
            init : function()
            {
                self = pleimo.Crowd.Modal;

                $.ajax({
                    type : "GET",
                    url  : base_url+"crowd"
                }).done(function(data) {

                    self.begin = $(data);
                    self.begin.find('#amount').mask('999.999,99',{reverse:true});

                    $(document).trigger("modalReady");

                });
            }
        },

        "Init" : function() {
            this.Modal.init();
        },

        "Open" : function( modal_object ) {
            if (modal_object)
            {
                $('.modal').remove();
                openMask();
                $('body').append(modal_object);
            }
        },

        "Signin" : function() {

            FB.login(function(response) {
                if(response.authResponse) {

                    $.ajax({
                        type : "POST",
                        url  : base_url+"signin/connect",
                        beforeSend : function() {
                            $('.crowd-modal button.save').html('<span class="wait"></span>');
                        },
                        error : function() {
                            $('.crowd-modal button.save').html($(pleimo.Language.Crowdfunding).find('data text[id="crowd-button-donate"] '+lang).text());
                        },
                        success : function (data) {

                            data = $.parseJSON(data);
                            pleimo.Session = data.session;

                            $("#crowd-donate #user").val(pleimo.Session.ID_USER);

                            pleimo.Crowd.Save();

                        }
                    });

                } else {
                    $('.crowd-modal button.save').html($(pleimo.Language.Crowdfunding).find('data text[id="crowd-button-donate"] '+lang).text());
                }
            },{scope: 'publish_stream, user_about_me, email, user_likes, friends_likes'});

        },

        "Save" : function () {

            $.ajax({
                type : "POST",
                url  : base_url+"crowd/donate/save",
                data : ({user     : $('#user').val(),
                         campaign : $('#campaign').val(),
                         value    : $('#amount').val(),
                         //method   : $('input[name="method"]:checked').val()
                }),
                success : function(data) {
                    pleimo.Template.Controller(base_url+'crowd/donate/process');
                }
            });

        },

        "Facebook" : function() {
            FB.ui({
                method:      "feed",
                link:        "https://www.pleimo.com/",
                name:        "Ajude a banda Erodelia recuperar seus instrumentos!",
                picture:     "https://pleimo-images.s3.amazonaws.com/artist/200/6/1/7/5/c/6175c0796208ec4d8b61292be73dd239.jpg",
                description: "O carro da banda Erodelia quebrou no Rodoanel a caminho do estúdio para gravar uma matéria para o SBT e ladrões acabaram roubando tudo, inclusive todos seus instrumentos musicais. #AjudeErodelia #pttp"
            });
        }
    }

    window.pleimo = pleimo;

});