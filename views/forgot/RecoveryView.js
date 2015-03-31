define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone');
        //ContentFactory  = require('views/ContentFactory');
        require('validate');
        require('validatePleimo');

    //var viewFactory = new ContentFactory();

    var RecoveryView = Backbone.View.extend({
        el: "#main",
        template: '/forgot/recovery',
        render: function(){
            this.addEvents();
            $(document).trigger("View.loaded");
        },

        addEvents: function(){

            $("#form-recovery").validate({

                rules : {
                    "passwd" : {
                        required : true
                    },
                    "cpasswd" : {
                        equalTo : "#passwd"
                    }
                },

                messages : {
                    "passwd" :{
                        required : null
                    },
                    "cpasswd" : {
                        required : null,
                        equalTo  : null
                    }
                },
                showErrors : function() {
                    this.defaultShowErrors();
                },

                submitHandler: function() {

                    $("#form-recovery .submit").data('callback', {
                        success: function(){
                            Backbone.history.navigate('/home', true);
                        }
                    });

                    $("#form-recovery .submit").addClass('load').trigger("click");

                }

            });

        }
    });

    return RecoveryView;
});