$(function () {
    $(document).ready(function() {
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
		
		createChart('#tweetchart');
    });
    
});

function createChart(chartID){    
	var chart;
	$(chartID).highcharts({
		credits: {
			enabled: false
		},
		chart: {
			type: 'spline',
			animation: Highcharts.svg, // don't animate in old IE
			marginRight: 1,
			events: {
				load: function() {

					// set up the updating of the chart each second
					var series = this.series[0];
					setInterval(function() {
						var y = (new Date()).getTime(), // current time
							x = Math.random();
						series.addPoint([y, x], true, true);
					}, 5000);
				}
			},
			backgroundColor: 'transparent',
			width: 400,
			height:200
		},
		title: {
			text: 'Live Tweets',				
			style: {
				color: '#FFFFFF',
			}
		},
		xAxis: {
			type: 'datetime',
			tickPixelInterval: 150,	
            labels: {
                style: {
                    color: '#FFFFFF'
                }
            }
		},
		yAxis: {
			gridLineColor: '#FFFFFF',
			lineColor: '#FFFFFF',
			title: {
				text: 'Tweets',				
				style: {
					color: '#FFFFFF',
				}
			},	
            labels: {
                style: {
                    color: '#FFFFFF'
                }
            }
			/* plotLines: [{
				value: 0,
				width: 1,
				color: '#FFFFFF'
			}] */
		},
		plotOptions: {
			series: {
				color: '#FFFFFF'
			}
		},
		tooltip: {
			formatter: function() {
					return '<b>'+ this.series.name +'</b><br/>'+
					Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
					Highcharts.numberFormat(this.y, 2);
			}
		},
		legend: {
			enabled: false
		},
		exporting: {
			enabled: false
		},
		series: [{
			name: 'Random data',
			data: (function() {
				// generate an array of random data
				var data = [],
					time = (new Date()).getTime(),
					i;

				for (i = -19; i <= 0; i++) {
					data.push({
						x: time + i * 1000,
						y: Math.random()
					});
				}
				return data;
			})()
		}]
	});
}