define([
    'underscore',
    'backbone',
    'models/UserModel'
], function(_, Backbone, UserModel) {
    "use strict";

    var base_url = window.base_url;

    var SessionModel = Backbone.Model.extend({
        url: function() {
            return  base_url+'xhr/spider';
        },
        defaults: {
            logged_in: false,
            user_id: ''
        },
        initialize: function() {
            this.user = new UserModel();
        },
        clear: function () {
            this.set(this.defaults);
            this.user.set(this.user.defaults);
        },
        updateSessionUser: function(userdata) {
            this.set({ user_id: userdata.ID_USER });
            this.user.set( _.pick( userdata, _.keys(this.user.defaults) ) );
        },
        checkAuth: function(callback) {
            var self = this;
            this.fetch({   // Check if there are tokens in localstorage
                success: function(mod, res){
                    if( typeof (res.ID_USER) !== 'undefined' ){
                        self.updateSessionUser( res );
                        self.set({ logged_in : true });
                        if(callback && ('success' in callback)) callback.success(mod, res);
                    } else {
                        self.set({ logged_in : false });
                        if(callback &&('error' in callback)) callback.error(mod, res);
                    }
                }, error:function(mod, res){
                    self.set({ logged_in : false });
                    if(callback &&('error' in callback)) callback.error(mod, res);
                }
            }).complete( function(){
                if(callback && ('complete' in callback)) callback.complete();
            });
        }
    });

    return SessionModel;
});