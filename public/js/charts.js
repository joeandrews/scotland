$(function () {
    $(document).ready(function() {
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
		
		createLineChart('#tweetchart');
		createBarChart('#opinionchart');
    });
    
});

function createLineChart(chartID){    
	var chart;
	$(chartID).highcharts({
		credits: {
			enabled: false
		},
		chart: {
			type: 'column',
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

function createBarChart(chartID){    
	$(chartID).highcharts({
		chart: {
			type: 'bar',
			backgroundColor: 'transparent',
			showAxes: 'false'
		},
		credits: {
			enabled: false
		},
		title: {
			text: 'The Polls'
		}, 
		xAxis: {
			/* categories: ['Opinions'] */
			labels: {
                enabled: false
            },			
            gridLineColor: 'transparent'
		},
		yAxis: {
			min: 0,
			labels: {
                enabled: false
            },			
            gridLineColor: 'transparent',			
			title: {
				text: ''
			}
			},
		legend: {
			backgroundColor: '#FFFFFF',
			reversed: true
		},
		plotOptions: {
			series: {
				stacking: 'normal',	
				dataLabels: {
                    enabled: true,
                    rotation: -45,
					useHTML: true,
                    inside: true,
					formatter: (function(){
						return '<span style="transform:rotate(90deg);">' + this.series.name + '</span>' + '<br></br>' + '<span class="chartlabel">' + this.y + '</span>';
					}),
				}
			},
		},
		colors: [
		   '#ffd84e', 
		   '#5ca6ff',
		   '#ff8e4e'		   
		],
        tooltip: {
            enabled: false
        },
        legend: {
            enabled: false
        },
		series: [{
			name: 'No',
			data: [52]
		}, {
			name: 'Undecided',
			data: [15]
		}, {
			name: 'Yes',
			data: [33]
		}]
		});
}