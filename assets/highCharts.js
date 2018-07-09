$(document).ready(function () {
    fetch('/matchesPerYear')
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            var chart = {
                type: 'column'
            };
            var title = {
                text: 'Matches per year'
            };
            var subtitle = {
                text: 'Source: Ipl  (Kaggle)'
            };
            var xAxis = {
                categories: Object.keys(myJson),
                crosshair: true
            };
            var yAxis = {
                min: 0,
                title: {
                    text: 'Matches'
                }
            };
            var plotOptions = {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            };
            var series = [{
                name: ['years'],
                data: Object.values(myJson)
            }];

            var json = {};
            json.chart = chart;
            json.title = title;
            json.subtitle = subtitle;
            json.xAxis = xAxis;
            json.yAxis = yAxis;
            json.series = series;
            json.plotOptions = plotOptions;
            $('#container1').highcharts(json);
        });
});