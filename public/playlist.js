$(function () {

    $.get(base_url+'application/www/language/playlists.xml', null, function (data, textStatus) {
        
        if (textStatus == "success") language = data;     

    }, 'xml').done(function(){ 

        $("#form-create-playlist").validate({

            errorElement: "span",

            rules : {
                "title" : {
                    required: true
                },
                "desc" : {
                    required: true
                }
            },

            messages : {
                "title" : {
                    required: $(language).find('data text[id="playlist-create-title-error"] '+lang).text()
                },
                "desc" : {
                    required: $(language).find('data text[id="playlist-create-desc-error"] '+lang).text()
                }
            },
            
            success : function() {
                errors = false;
            },

            invalidHandler  : function(form, validator) {
                errors = true;
            },

            submitHandler: function(form) {

                $("#form-create-playlist .submit").addClass('wait').val(null);

                $.ajax({
                    type: "POST",
                    url: base_url+"xhr/playlist/save",
                    data:  { music : $("#music").val(), title : $("#title").val(), desc : $("#desc").val(), privacy : $("#privacy").val() }
                }).done(function() {
                    closeMask();
                });
                
            }

        });
                
    });
 
});