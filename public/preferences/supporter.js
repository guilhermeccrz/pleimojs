$(function () {

    var pleimo = window.pleimo || {};
    var scroll;
    var errors;

    $.get(base_url+'application/www/language/supporters.xml', null, function (data, textStatus) {

        if (textStatus == "success") {
            pleimo.Language = {
                Preferences : data
            }
        }

    }, 'xml')


    var closeMask = function() {

        $("#mask, .modal").hide();
        $(document).scrollTop(scroll);

        scroll = null;
        errors = false;

        if ($('.zoomContainer').length > 0) {
            $('.zoomContainer').remove(); // remove zoom container from DOM
        }

        $(".blackbox, .outbox").remove();

    };

    $(document).ready(function(){
        pleimo.Supporter.init();
    });

    $('button.save').click(function() {
        pleimo.Supporter.Save();
        closeMask();
    });

    $('button.close').click(function() {
        pleimo.Supporter.Close();
        closeMask();
    });

    pleimo.Supporter = {

        "init" : function () {
            pleimo.Suggest.init($('#artist-search'), $('#artist-suggest'));
        },

        "Save" : function () {

            pleimo.Options.support_artist = 1;




            $.ajax({
                url  : window.base_url+'support/save',
                type : "POST",
                data : ({artist: $('#selectedArtist').val(), name: $('#artist-search').val()}),
                beforeSend : function () {
                    $('button.save').html('<span class="wait"></span>');
                },
                error : function () {
                    $('button.save').html($(pleimo.Language.Preferences).find('data text[id="supporter-confirm"] '+lang).text());
                },
                success : function () {
                    pleimo.settingsUpdate = 1;




                    if (location.pathname == "/profile"){

                        //setting saving form
                        $('#form-settings').sayt({'autosave': false, 'autorecover': false, 'days': 1});
                        $('#form-settings').sayt({'savenow': true});
                        window.location.reload(true);
                    }


                    if (typeof pleimo.Options.chose_genders === 'undefined'){
                        closeMask();
                        pleimo.Template.Genders();

                    }



                }
            });

        },

        "Close" : function () {

            pleimo.Options.support_artist = 0;

            $.ajax({
                url  : window.base_url+'support/close',
                type : "POST",
                success : function () {


                    if (typeof pleimo.Options.chose_genders === 'undefined')
                        return pleimo.Template.Genders();




                }
            });

        }
    }

    window.pleimo = pleimo;
});
