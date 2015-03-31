$(function () {

    var pleimo = window.pleimo || {};

    $.get(base_url+'application/www/language/preferences.xml', null, function (data, textStatus) {

        if (textStatus == "success") pleimo.Language = data;

    }, 'xml').done(function(){

        $('button.save').click(function(e){

            e.stopPropagation();
            e.preventDefault();

            pleimo.Genders.Save();

        });

        $('.button.close.genders').click(function(e){
            e.stopPropagation();
            e.preventDefault();

            pleimo.Genders.Close();
        });

        $('.welcome-modal input[type=checkbox]').each(function(){

            var self = $(this),
                label = self.next(),
                label_text = label.text();

            label.remove();

            self.iCheck({
                checkboxClass: 'icheckbox_prefs',
                radioClass: 'iradio_prefs',
                insert: label_text +' <div class="icheck_prefs-icon"></div>'
            });

        });

    });

    var genders = {

        "Save" : function() {

            $.ajax({
                url  : base_url+'genders/save',
                type : "POST",
                data : $('#preferred-genders').serialize(),
                beforeSend : function()
                {
                    $('button.save').empty();
                    $('button.save').html('<span class="wait"></span>');
                },
                success : function()
                {
                    //History.pushState(null, null, base_url+'home');
                    pleimo.Template.Controller('home');
                    pleimo.Options.chose_genders = 1;

                    closeMask();
                }
            });

        },

        "Close" : function() {
            pleimo.Options.chose_genders = 0;

            $.ajax({
                url  : window.base_url+'genders/close',
                type : "POST",
                success : function () {

                    closeMask();

                }
            });
        }

    }


    pleimo.Genders = genders;

    window.pleimo = pleimo;

});