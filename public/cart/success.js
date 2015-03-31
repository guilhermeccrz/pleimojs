$(function () {

    $.get(base_url+'application/www/language/cart.xml', null, function (data, textStatus) {
        
        if (textStatus == "success") language = data;     

    }, 'xml').done(function(){


    });
    
});