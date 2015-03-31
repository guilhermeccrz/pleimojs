define([
    'backbone'
], function(Backbone) {
    "use strict";

    var UserModel = Backbone.Model.extend({

        defaults: {
            SUBSCRIPTION_STATUS: '',
            TOKEN: '',
            ID_USER: '',
            ACCOUNT_TYPE: '',
            NAME: '',
            LAST_NAME: '',
            EMAIL: '',
            IMG_USER: '',
            ARTISTS: false,
            OPTIONS: {
                "chose_genders": 0,
                "support_artist": 0
            },
            session_id: '',
            country_code: '',
            language: '',
            user_data: ''
        }

    });

    return UserModel;
});