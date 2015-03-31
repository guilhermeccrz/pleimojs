$(function () {

    $.get(base_url+'application/www/language/dashboard.xml', null, function (data, textStatus) {
        
        if (textStatus == "success") language = data;     

    }, 'xml').done(function(){

        var pleimo = window.pleimo || {};

        $('#rockinrio').click(function(e){
            if ($(this).hasClass('inPromo')){
                return false;
            }

            pleimo.Dashboard.rir();
        });

        $(document).on('click', 'a.btn-blue.activate', function(e){
            pleimo.Dashboard.activate();
        });

        $(document).on('click', 'a.btn-blue.inactivate', function(e){
            pleimo.Dashboard.inactivate();
        });

        function drawChart() {

            var data = new google.visualization.DataTable();

            data.addColumn('date', $(language).find('data text[id="dashboard-graphic-period"] '+lang).text());
            data.addColumn('number', $(language).find('data text[id="dashboard-graphic-visits"] '+lang).text());

            count_daily = 0;

            var pstart = new Date(start);
            var pend   = new Date(end);

            for (var i = 0; i < daily.length; i++) {
                var day = (daily[i].DATE).split("-");

                count_daily = count_daily + parseInt(daily[i].TOTAL);
                data.addRow([new Date(parseInt(day[0]), parseInt(day[2]-1), parseInt(day[1])), parseInt(daily[i].TOTAL)]);

                if (daily.length === 1) data.addRow([pend, 0]);
            }

            var options = {
                chartArea: { left : 70, top : 30, width : "88%", height : "70%" },
                hAxis: {
                    title: $(language).find('data text[id="dashboard-graphic-x-title1"] '+lang).text()+pstart.toLocaleDateString(lang)+$(language).find('data text[id="dashboard-graphic-x-title2"] '+lang).text()+pend.toLocaleDateString(lang)+'',
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

            var chart = new google.visualization.LineChart(document.getElementById('chartOverview'));
            chart.draw(data, options);

            $("#chartLoading").hide();
            $(".box-value.visits .value").html(count_daily);
            $(".box-value.musics .value").html(count_listened);
        }

        var dashboard = {

            Artist       : artist,
            Subscription : subscription,

            init: function() {
                $.ajax({
                    dataType: "script",
                    url:'//www.google.com/jsapi?autoload={"modules":[{"name":"visualization","version":"1","packages":["corechart","table"],language:"pt-BR",callback:pleimo.Dashboard.loaded}]}'
                });
            },

            loaded:function() {
                google.load("visualization", "1", {packages:["corechart"], language: "pt-BR"});
                google.setOnLoadCallback(drawChart);

                $( "#rangeMinMaxPicker" ).datepick({
                    alignment: 'bottomRight',
                    showAnim: 'slideDown',
                    rangeSelect: true,
                    minDate: '-1y',
                    maxDate: new Date(),
                    monthsToShow: [1, 3],
                    onClose: function(dates) {

                        $("#chartLoading").show();

                        start = dates[0].toISOString();
                        end   = dates[1].toISOString();

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
                })
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
                })
            },

            rir: function() {

                $.ajax({
                    type: "POST",
                    url : base_url+'dashboard/rockinriopromo',
                    beforeSend : function() {
                        openMask();
                        $('body').append('<div class="modal rockinrio-artist outbox loading">');
                    },
                    success : function (data) {
                        $('div.modal.rockinrio-artist').removeClass('loading');
                        $('div.modal.rockinrio-artist').append(data);
                    }
                });

            }
        }

        pleimo.Dashboard = dashboard;

        $(document).ready(function() {
            dashboard.init();
        });

        $(document).on('ajaxloaded', function(evt, uri, status) {
            var arr = uri.split('/');

            if ((arr.length <= 2) && (arr[0] == 'dashboard')) {
                dashboard.init();
            }
        });

        window.pleimo = pleimo;
    });
    
});