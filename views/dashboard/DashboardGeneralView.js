define(function(require) {
    "use strict";

    var $               = require('jquery'),
        Backbone        = require('backbone'),
        ContentFactory    = require('views/ContentFactory'),
        DashboardMenuView = require('views/dashboard/DashboardMenuView');

        require('datepick');
        require('datepickPtBr');

    var viewFactory = new ContentFactory();

    var DashboardGeneralView = Backbone.View.extend({
        el: '#main',
        render: function() {
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



            var language,
                lang = window.lang,
                daily = window.daily || [],
                count_daily = window.count_daily,
                count_listened = window.count_listened,
                start = window.start,
                end = window.end,
                artist = window.artist,
                base_url = window.base_url;

            $.get(base_url+'application/www/language/dashboard.xml', null, function (data, textStatus) {

                if (textStatus == "success") language = data;

            }, 'xml').done(function(){

                var pleimo = window.pleimo || {};



                $(document).on('click', 'a.btn-blue.activate', function(e){
                    pleimo.Dashboard.activate();
                });

                $(document).on('click', 'a.btn-blue.inactivate', function(e){
                    pleimo.Dashboard.inactivate();
                });

                function replaceAll(string, token, newtoken) {
                    if (!string || (string.length === 0)) { return string; }
                    while (string.indexOf(token) != -1) {
                        string = string.replace(token, newtoken);
                    }
                    return string;
                }

                start = replaceAll(start,"-", "/");
                end = replaceAll(end,"-", "/");

                function drawChart() {
                    var data;
                    /* jshint ignore:start */
                    data = new google.visualization.DataTable();
                    /* jshint ignore:end */

                    data.addColumn('date', $(language).find('data text[id="dashboard-graphic-period"] '+lang).text());
                    data.addColumn('number', $(language).find('data text[id="dashboard-graphic-visits"] '+lang).text());

                    count_daily = 0;

                  //  start = replaceAll(start,"-", "/");
                  //  end = replaceAll(end,"-", "/");

                    var pstart = new Date(start);
                    var pend   = new Date(end);

                    var len = daily.length;
                    if (len > 0) {
                        for (var i = 0; i < daily.length; i++) {
                            var day = (daily[i].DATE).split("-");

                            count_daily = count_daily + parseInt(daily[i].TOTAL);
                            data.addRow([new Date(parseInt(day[0]), parseInt(day[2]-1), parseInt(day[1])), parseInt(daily[i].TOTAL)]);

                            if (daily.length === 1) data.addRow([pend, 0]);
                        }
                    }

                    var options = {
                        chartArea: { left : 70, top : 30, width : "88%", height : "70%" },
                        hAxis: {
                            title: $(language).find('data text[id="dashboard-graphic-x-title1"] '+lang).text()+'  '+pstart.toLocaleDateString(lang)+'  '+$(language).find('data text[id="dashboard-graphic-x-title2"] '+lang).text()+'  '+pend.toLocaleDateString(lang)+'',
                            titleTextStyle: { color: '#999999', italic: false, fontSize: 13 },
                            textStyle: { color: '#999999', italic: false, fontSize: 11 },
                            gridlines: { color: '#ffffff' },
                            format: 'd/MMM'
                        },
                        vAxis: {
                            title: $(language).find('data text[id="dashboard-graphic-y-title"] '+lang).text(),
                            minValue: 0,
                            titleTextStyle: { color: '#999999', italic: false, fontSize: 13 },
                            textStyle: { color: '#999999', italic: false, fontSize: 12 },
                            format: '#,###.##',
                            viewWindow: { min: 0 }
                        },
                        fontName: 'Lato',
                        legend: { position: 'none'},
                        colors: ['#51c7f4']
                    };

                    var chart;
                    /* jshint ignore:start */
                    chart = new google.visualization.LineChart(document.getElementById('chartOverview'));
                    /* jshint ignore:end */

                    chart.draw(data, options);

                    $("#chartLoading").hide();
                    $(".box-value.visits .value").html(count_daily);
                    $(".box-value.musics .value").html(count_listened);
                }

                var dashboard = {

                    Artist       : window.artist,
                    Subscription : window.subscription,

                    init: function() {
                       $.getScript('//www.google.com/jsapi?autoload={"modules":[{"name":"visualization","version":"1","packages":["corechart","table"],language:"'+lang+'",callback:pleimo.Dashboard.loaded}]}');
                    },

                    loaded:function() {
                        /* jshint ignore:start */
                        google.load("visualization", "1", {packages:["corechart"], language: lang});
                        google.setOnLoadCallback(drawChart);
                        /* jshint ignore:end */

                        $( "#rangeMinMaxPicker" ).datepick({
                            alignment: 'bottomRight',
                            showAnim: 'slideDown',
                            rangeSelect: true,
                            minDate: '-1y',
                            maxDate: new Date(),
                            monthsToShow: [1, 3],
                            onClose: function(dates) {

                                $("#chartLoading").show();

                                var dt_start = dates[0] || new Date();
                                var dt_end = new Date();
                                dt_start.setDate(dt_end.getDate() - 30);

                                if (dates[1]) {
                                    dt_end = dates[1];
                                }

                                start = dt_start.toISOString();
                                end   = dt_end.toISOString();

                                $.ajax({
                                    type : "POST",
                                    url  : base_url+"dashboard/graph",
                                    data : { start : start, end : end, artist : artist }
                                }).done(function( data ) {

                                    data = $.parseJSON(data);

                                    daily = data.count_daily;
                                    count_listened = data.count_listened;

                                    drawChart();

                                });

                            }
                        });

                        drawChart();
                    },

                    activate : function () {
                        $.ajax({
                            type : "POST",
                            url  : base_url+"artist/edit/activate",
                            beforeSend : function() {
                                $('a.btn-blue.activate').text('');
                                $('a.btn-blue.activate').addClass('loading');
                            },
                            success : function() {
                                $('a.btn-blue.activate').text($(language).find('data text[id="dashboard-inactivate-artist"] '+lang).text());
                                $('a.btn-blue.activate').removeClass('loading activate').addClass('inactivate');
                                $('span.artist-status').text($(language).find('data text[id="dashboard-active-artist"] '+lang).text());
                                $('span.artist-status').removeClass('inactive').addClass('active');
                            }
                        });
                    },

                    inactivate : function () {
                        $.ajax({
                            type : "POST",
                            url  : base_url+"artist/edit/inactivate",
                            beforeSend : function() {
                                $('a.btn-blue.inactivate').text('');
                                $('a.btn-blue.inactivate').addClass('loading');
                            },
                            success : function() {
                                $('a.btn-blue.inactivate').text($(language).find('data text[id="dashboard-activate-artist"] '+lang).text());
                                $('a.btn-blue.inactivate').removeClass('loading inactivate').addClass('activate');
                                $('span.artist-status').text($(language).find('data text[id="dashboard-inactive-artist"] '+lang).text());
                                $('span.artist-status').removeClass('active').addClass('inactive');
                            }
                        });
                    }
                };

                pleimo.Dashboard = dashboard;

                dashboard.init();

                window.pleimo = pleimo;
            });

        }
    });

    return DashboardGeneralView;
});