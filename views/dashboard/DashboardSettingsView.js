define(function(require){
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone'),
        ContentFactory    = require('views/ContentFactory'),
        DashboardMenuView = require('views/dashboard/DashboardMenuView');

    var viewFactory = new ContentFactory();
    var base_url = window.base_url;
    var lang = window.lang;

    var DashboardSettingsView = Backbone.View.extend({
        el: '#main',
        initialize: function(){

        },
        render: function(){
            var that = this;

            this.template = location.pathname.substr(1);

            viewFactory.loadTemplate(this.template, {
                success: function(data, status) {
                    that.$el.html(data);
                    that.addEvents();
                },
                error: function(data, status) {
                    if (status == 404) {
                        that.$el.html(data);
                    }
                }
            }, { cache: false });
        },
        addEvents: function() {
            this.dashboardMenuView = new DashboardMenuView();
            this.dashboardMenuView.render();

            var language;

            $.get(base_url+'application/www/language/dashboard.xml', null, function (data, textStatus) {

                if (textStatus == "success") language = data;

            }, 'xml').done(function(){

                var pleimo = window.pleimo || {};

                // Altera o texto abaixo do select
                $('body').on('change', 'select[name=function][class=unregistered]', function(e) {
                    actions.change($(this));
                    e.stopImmediatePropagation();
                });

                $('body').on('change', 'select[name=function][class=registered]', function(e) {
                    actions.change($(this));
                    actions.edit($(this));
                    e.stopImmediatePropagation();
                });

                $('body').on('click', 'button.remove.unregistered', function(e) {
                    actions.removeTemp($(this));
                    e.stopImmediatePropagation();
                });

                $('#addUser').click(function(e) {
                    actions.create(e);
                    e.stopImmediatePropagation();
                });

                $(document).on('click', 'button.remove.registered', function(e){
                    actions.remove($(this));
                    e.stopImmediatePropagation();
                });

                $(document).on('click', 'button.add.unregistered', function(e){
                    actions.add($(this));
                    e.stopImmediatePropagation();
                });

                var actions = {
                    "create" : function(event)
                    {
                        event.preventDefault();

                        var html = '<div class="settings-user">\
                                <div class="img-holder"></div>\
                                <div class="info">\
                                    <h4><input type="text" name="email" placeholder="'+$(language).find("data text[id=\"settings-add-field-placeholder\"] "+lang).text()+'"></h4>\
                                    <p class="function">\
                                        <select name="function" id="hierarchy" class="unregistered">\
                                            <option value="1">'+$(language).find("data text[id=\"settings-hierarchy-1-title\"] "+lang).text()+'</option>\
                                            <option value="2">'+$(language).find("data text[id=\"settings-hierarchy-2-title\"] "+lang).text()+'</option>\
                                            <option value="3">'+$(language).find("data text[id=\"settings-hierarchy-3-title\"] "+lang).text()+'</option>\
                                            <option value="4">'+$(language).find("data text[id=\"settings-hierarchy-4-title\"] "+lang).text()+'</option>\
                                        </select>\
                                    </p>\
                                    <p class="detail">'+$(language).find("data text[id=\"settings-hierarchy-1-desc\"] "+lang).text()+'</p>\
                                    <p>\
                                        <button class="button remove unregistered">'+$(language).find("data text[id=\"settings-remove-button\"] "+lang).text()+'</button> <button class="button add unregistered">'+$(language).find("data text[id=\"settings-add-button\"] "+lang).text()+'</button>\
                                    </p>\
                                </div>\
                            </div>';

                        $('.settings-admin').append(html);

                        return false;
                    },

                    "add" : function(element)
                    {
                        var parent = $(element).parent().parent().parent();
                        var hierarchy = $(parent).find('select[id="hierarchy"]').val();

                        $(parent).find('span[class="error"]').remove();
                        $(parent).find('input[name="email"]').removeClass('error');

                        if ($(document).find('input[value="'+$(parent).find('input[name="email"]').val()+'"]').length > 0)
                        {
                            $(parent).find('input[name="email"]').addClass('error');
                            $(parent).find('input[name="email"]').after('<span class="error">'+$(language).find("data text[id=\"settings-error-admin-exists\"] "+lang).text()+'</span>');
                            return false;
                        }

                        $.ajax({
                            url  : base_url+'dashboard/settings/add',
                            type : "POST",
                            data : ({email : $(parent).find('input[name="email"]').val(), artist : $('#artist').val(), hierarchy : hierarchy}),
                            beforeSend : function()
                            {
                                $('button.add.unregistered').empty();
                                $('button.add.unregistered').html('<span class="wait"></span>');
                            },
                            success : function(data)
                            {
                                if (data != 1){
                                    data = $.parseJSON(data);
                                    var html = '<div class="settings-user">\
                                            <input type="hidden" id="user" name="user" value="'+data.ID_USER+'">\
                                            <input type="hidden" id="usermail" name="usermail" value="'+data.EMAIL+'">\
                                            <img src="'+data.IMG_USER+'" alt="Nome do Usuário">\
                                            <div class="info">\
                                                <h4>'+data.NAME+' '+data.LASTNAME+'</h4>\
                                                <p class="function">\
                                                    <select name="function" id="hierarchy" class="registered">\
                                                        <option value="1">'+$(language).find("data text[id=\"settings-hierarchy-1-title\"] "+lang).text()+'</option>\
                                                        <option value="2">'+$(language).find("data text[id=\"settings-hierarchy-2-title\"] "+lang).text()+'</option>\
                                                        <option value="3">'+$(language).find("data text[id=\"settings-hierarchy-3-title\"] "+lang).text()+'</option>\
                                                        <option value="4">'+$(language).find("data text[id=\"settings-hierarchy-4-title\"] "+lang).text()+'</option>\
                                                    </select>\
                                                    <span class="success">'+$(language).find("data text[id=\"settings-success-edit\"] "+lang).text()+'</span>\
                                                </p>\
                                                <p class="detail">'+$(language).find("data text[id=\"settings-hierarchy-"+hierarchy+"-desc\"] "+lang).text()+'</p>\
                                                <p>\
                                                    <button class="button remove registered">'+$(language).find("data text[id=\"settings-remove-button\"] "+lang).text()+'</button>\
                                                </p>\
                                            </div>\
                                        </div>';
                                    $('.settings-admin').append(html);
                                    $(parent).remove();
                                    $('.settings-user').last().find('select[id="hierarchy"]').val(hierarchy);
                                }else{
                                    $(parent).find('span[class="error"]').remove();
                                    $(parent).find('input[name="email"]').addClass('error');
                                    $(parent).find('input[name="email"]').after('<span class="error">'+$(language).find("data text[id=\"settings-error-no-user\"] "+lang).text()+'</span>');
                                }
                            }
                        });
                    },

                    "remove" : function(element)
                    {
                        var parent = $(element).parent().parent().parent();
                        $.ajax({
                            url  : base_url+'dashboard/settings/remove',
                            type : "POST",
                            data : ({artist : $('#artist').val(), user : $(parent).find('input[id="user"]').val()}),
                            beforeSend : function()
                            {
                                $(parent).remove();
                            },
                            error   : function()
                            {
                                $('.settings-admin').append(parent);
                            }
                        });
                    },

                    "removeTemp" : function(element)
                    {
                        $(element).parents('.settings-user').remove();
                    },

                    "change" : function(element)
                    {
                        var res = $(language).find('data text[id="settings-hierarchy-4-desc"] '+lang).text();
                        if ($(element).val() == '1') {
                            res = $(language).find('data text[id="settings-hierarchy-1-desc"] '+lang).text();
                        } else if ($(element).val() == '2') {
                            res = $(language).find('data text[id="settings-hierarchy-2-desc"] '+lang).text();
                        } else if ($(element).val() == '3') {
                            res = $(language).find('data text[id="settings-hierarchy-3-desc"] '+lang).text();
                        }
                        $(element).parent().next().text(res);
                    },

                    "edit" : function(element)
                    {
                        var parent = $(element).parent().parent().parent();
                        var hierarchy = $(element).val();

                        $.ajax({
                            url  : base_url+'dashboard/settings/edit',
                            type : "POST",
                            data : ({user : $(parent).find('input[id="user"]').val(), artist : $('#artist').val(), hierarchy : hierarchy}),
                            beforeSend : function()
                            {
                                $(element).after('<span class="loading"></span>');
                            },
                            success : function()
                            {
                                $('span.loading').remove();
                                $(element).parent().find('span.success').show();
                                $(element).parent().find('span.success').fadeOut(2000);
                            }
                        });
                    }
                };

                pleimo.Dashboard = window.pleimo.Dashboard || {};
                pleimo.Dashboard.Settings = actions;

                window.pleimo = pleimo;
            });


        }


    });

    return DashboardSettingsView;
});