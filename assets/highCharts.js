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
        //3rd chart
        fetch('/extraRunsConcededPerTeam')
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            var chart = {
                type: 'column'
            };
            var title = {
                text: 'Extra Runs Conceded Per Team'
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
                    text: 'extra runs'
                }
            };
            var plotOptions = {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            };
            var series = [{
                name: ['Teams'],
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
            $('#container3').highcharts(json);
        });
         //4 th chart
         fetch('/topEconomicalBowlers')
         .then(function (response) {
             return response.json();
         })
         .then(function (myJson) {
             var chart = {
                 type: 'column'
             };
             var title = {
                 text: 'Top Economical Bowlers'
             };
             var subtitle = {
                 text: 'Source: Ipl  (Kaggle)'
             };
             var xAxis = {
                 categories: myJson.map(function (el) { return el.name; }),
                 crosshair: true
             };
             var yAxis = {
                 min: 0,
                 title: {
                     text: 'Economy Rate'
                 }
             };
             var plotOptions = {
                 column: {
                     pointPadding: 0.2,
                     borderWidth: 0
                 }
             };
             var series = [{
                 name: ['Players'],
                 data: myJson.map(function (el) { return el.economy_rate; })
             }];
 
             var json = {};
             json.chart = chart;
             json.title = title;
             json.subtitle = subtitle;
             json.xAxis = xAxis;
             json.yAxis = yAxis;
             json.series = series;
             json.plotOptions = plotOptions;
             $('#container4').highcharts(json);
         });
});