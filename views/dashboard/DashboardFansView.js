define(function(require){
    "use strict";

    var $                   = require('jquery'),
        Backbone            = require('backbone'),
        ContentFactory      = require('views/ContentFactory'),
        DashboardMenuView   = require('views/dashboard/DashboardMenuView'),
        SVG = require('svg');

        require('datepick');
        require('datepickPtBr');

    var viewFactory = new ContentFactory();
    var lang = window.lang;

    var DashboardFansView = Backbone.View.extend({
        el: "#main",
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

            /**
             * Pleimo namespace
             * @namespace pleimo
             */
            var pleimo = window.pleimo || {};

            pleimo.Dashboard = pleimo.Dashboard || {};

            pleimo.Dashboard.Fans = {
                onLoad: function() {
                    pleimo.Dashboard.Fans.load();
                },
                init: function() {
                    $.getScript('//www.google.com/jsapi?autoload={"modules":[{"name":"visualization","version":"1","packages":["corechart","table"],language:"'+lang+'",callback:pleimo.Dashboard.Fans.onLoad}]}');
                },
                load: function() {
                    this.Ages.load();
                    this.Map.load();
                    this.Genders.load();
                }
            };

            pleimo.Dashboard.Fans.Ages = {
                chart: null,
                loadedData: null,
                onLoaded: function(data) {
                    var Ages = pleimo.Dashboard.Fans.Ages;
                    Ages.loadedData = data;

                    if ((Ages.loadedData.rows[0].c[1].v > 0)&&(Ages.loadedData.rows[0].c[2].v > 0)) {
                        $('#chartAges').prev().hide();
                        var options = {
                            fontName: 'Lato',
                            bar: { groupWidth: '20%' },
                            chartArea:{left:45,top:10,width:"96%",height:"75%"},
                            hAxis: {title: "Idade", textStyle: {fontSize:11}},
                            vAxis: {title: "Porcentagem", gridlines: {color: "#efefef"}},
                            orientation: "horizontal",
                            legend: {position: 'bottom'},
                            isStacked: true,
                            colors: ['#E40046', '#149dcc', '#efefef'],
                            width: 655,
                            height: 220
                        };

                        Ages.chart.draw(data, options, Ages.setFormatter);
                    } else {
                        $('#chartAges').removeClass('loading');
                        $('#chartAges').prev().show();
                    }
                },
                setFormatter: function(data, dataTable) {
                    var formatter;
                    /* jshint ignore:start */
                    formatter = new google.visualization.NumberFormat(
                        {pattern: '#,##0.00', fractionDigits: 2, suffix: '%'});
                    /* jshint ignore:end */

                    formatter.format(dataTable, 1);
                    formatter.format(dataTable, 2);
                },
                load: function(start, end) {
                    /* jshint ignore:start */
                    var Chart = pleimo.Dashboard.Chart,
                        data = ((start != null) && (end != null)) ? { start : start, end : end } : null;

                    this.chart = new Chart('#chartAges', google.visualization.ColumnChart);

                    this.chart.load(window.base_url+'dashboard/fans/fansByAge', data, this.onLoaded);
                    /* jshint ignore:end */
                }
            };

            pleimo.Dashboard.Fans.Map = {
                chart: null,
                loadedData: null,
                onLoaded: function(data) {
                    var Map = pleimo.Dashboard.Fans.Map;
                    Map.loadedData = data;

                    var options = {
                        chartArea:{left:0, top:20, width:"100%", height:"90%"},
                        fontName: 'Lato',
                        legend: {
                            textStyle: {bold: true, fontName: 'Lato', color: '#424242'}
                        },
                        displayMode: 'markers',
                        colors: ['#149dcc', '#db3e59']
                    };

                    Map.chart.draw(data, options, Map.setFormatter);
                },
                setFormatter: function(data, dataTable) {
                    var formatter;
                    /* jshint ignore:start */
                    formatter = new google.visualization.NumberFormat(
                        {pattern: '#,###'});
                    /* jshint ignore:end */

                    formatter.format(dataTable, 1);
                },
                load: function(start, end) {
                    /* jshint ignore:start */
                    var Chart = pleimo.Dashboard.Chart,
                        data = ((start != null) && (end != null)) ? { start : start, end : end } : null;

                    this.chart = new Chart('#chartMap', google.visualization.GeoChart);

                    this.chart.load(window.base_url+'dashboard/fans/fansByCountry', data, this.onLoaded);
                    /* jshint ignore:end */
                }
            };

            pleimo.Dashboard.Fans.Genders = {
                JSON: 'dashboard/fans/fansByGender',
                TOP: 71,
                POS_F: 55,
                POS_M: 176,
                IMG: {
                    'f': {
                        'full': '/templates/pleimo-s3/pleimo-assets/images/dashboard/graph_f_full.png',
                        'empty': '/templates/pleimo-s3/pleimo-assets/images/dashboard/graph_f.png'
                    },
                    'm': {
                        'full': '/templates/pleimo-s3/pleimo-assets/images/dashboard/graph_m_full.png',
                        'empty': '/templates/pleimo-s3/pleimo-assets/images/dashboard/graph_m.png'
                    }
                },
                IMG_W: 116,
                IMG_H: 250,

                load: function() {
                    var self = this;
                    this.el = $('#chartGenders');

                    $.ajax({
                        url: window.base_url+this.JSON,
                        dataType: 'json',
                        cache: false,
                        beforeSend: function() {
                            self.el.empty();
                            self.el.addClass('loading');
                        },
                        success: function(jsonData) {
                            self.onLoaded(jsonData);
                        }
                    });


                },
                onLoaded: function(data) {
                    this.el.empty();
                    this.el.removeClass('loading');

                    if (data && (data.cols.length > 0) && (data.rows[0].c[0].v > 0)){
                        this.el.prev().hide();

                        this.draw = SVG('chartGenders').size(330, 390);

                        var total = parseInt(data.rows[0].c[0].v) + parseInt(data.rows[0].c[1].v);

                        var per_f = (total === 0) ? 0 : Math.round(data.rows[0].c[0].v / total * 100);
                        var per_m = (total === 0) ? 0 : Math.round(data.rows[0].c[1].v / total * 100);

                        this.drawFigure(this.IMG.f.empty, this.IMG.f.full, this.POS_F, data.cols[0].label, per_f, "left");
                        this.drawFigure(this.IMG.m.empty, this.IMG.m.full, this.POS_M, data.cols[1].label, per_m, "right");

                        return ;
                    }

                    this.el.prev().show();
                },
                drawFigure: function(empty, full, pos, gender, percent, align) {
                    var draw = this.draw;
                    var empty_img = draw.image(empty);
                    empty_img.move(pos, this.TOP);

                    var full_img = draw.image(full);
                    full_img.move(pos, this.TOP);

                    var h = Math.round(this.IMG_H * (percent / 100));
                    var clip = draw.rect(this.IMG_W, h);
                    clip.move(pos, Math.round(this.TOP + this.IMG_H - h));

                    var group = draw.group();
                    var text = this.drawText(gender, percent, align);
                    if (h > 30) {
                        text.y(this.TOP + this.IMG_H - h + 10);
                    }

                    full_img.clipWith(clip);

                    return {empty: empty_img, full: full_img, clip: clip, group: group, text: text};
                },
                drawText: function(gender, percent, align) {
                    var draw = this.draw;
                    var _LINEW = 90;
                    var grp = draw.group();
                    var line = draw.line(0, 0, _LINEW, 0).stroke({ width: 1 });

                    var txt = draw.plain(gender).font({
                        family:   'Lato'
                        , size:     13
                        , anchor:   'left'
                        , leading:  '1.5em'
                        , fill:     '#424242'
                    }).move(0,-20);

                    var ptxt = draw.plain(percent + '%').font({
                        family:   'Lato'
                        , size:     13
                        , anchor:   'left'
                        , leading:  '1.5em'
                        , fill:     '#767676'
                    }).move(0,3);

                    grp.add(line).add(txt).add(ptxt).move(0, this.TOP + this.IMG_H - 10);

                    if (align== "right") {
                        txt.x(_LINEW-Math.round(txt.bbox().width));
                        ptxt.x(_LINEW-Math.round(ptxt.bbox().width));
                        grp.x(330 - grp.bbox().width);
                    }
                    return grp;
                }
            };

            pleimo.Dashboard.Chart = function(el, chartClass) {
                this.options = {};
                this.data = null;
                this.el = $(el);
                this.req = null;
                this.class = chartClass;

                this.draw = function(data, options, format) {
                    this.options = options;
                    this.data = data;
                    var dataTable;
                    /* jshint ignore:start */
                    dataTable = new google.visualization.DataTable(data);
                    /* jshint ignore:end */

                    if (typeof(format) == "function") format(data, dataTable);

                    this.el.removeClass('loading');

                    this.chart = new this.class(this.el[0]);
                    this.chart.draw(dataTable, this.options);
                };

                this.load = function(url, data, callback) {
                    var self = this;

                    this.req = $.ajax({
                        url: url,
                        data: data || {},
                        dataType: 'json',
                        cache: false,
                        beforeSend: function() {
                            self.el.empty();
                            self.el.addClass('loading');
                        },
                        success: function(jsonData) {
                            if (typeof(callback) == "function")
                                callback(jsonData);
                        }
                    });
                };
            };
            window.pleimo = pleimo;

            pleimo.Dashboard.Fans.init();
        }
    });

    return DashboardFansView;
});