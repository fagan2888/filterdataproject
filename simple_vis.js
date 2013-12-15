
d3.csv("data/MBCR_Trip_Records_2011.csv", function (yelp_data) {
	

//var bubbleChart = dc.bubbleChart("#dc-bubble-graph");
var pieChart = dc.pieChart("#dc-pie-graph");
var volumeChart = dc.barChart("#dc-volume-chart");
var lineChart = dc.lineChart("#dc-line-chart");
var dataTable = dc.dataTable("#dc-table-graph");
//var rowChart = dc.rowChart("#dc-row-graph");


var ndx = crossfilter(yelp_data);
	

var startValue = ndx.dimension(function (d) {
        return d.iPassenger;
    });
	
    var startValueGroup = startValue.group();
	

    var businessDimension = ndx.dimension(function (d) { return d.Division; });
	
	pieChart.width(200)
        .height(200)
        .transitionDuration(1500)
        .dimension(startValue)
        .group(startValueGroup)
        .radius(90)
        .minAngleForLabel(0)
        .label(function(d) { return d.data.key; })
        .on("filtered", function (chart) {
            dc.events.trigger(function () {
                if(chart.filter()) {
                    console.log(chart.filter());
                    volumeChart.filter([chart.filter()-50,chart.filter()-(-50)]);
                    }
                else volumeChart.filterAll();
            });
        });
 
 lineChart.width(230)
        .height(200)
        .dimension(startValue)
        .group(startValueGroup)
        .x(d3.scale.linear().domain([0.5, 5.5]))
        .valueAccessor(function(d) {
            return d.value;
            })
            .renderHorizontalGridLines(true)
            .elasticY(true)
            .xAxis().tickFormat(function(v) {return v;});   ;
			
 volumeChart.width(500)
            .height(200)
            .dimension(startValue)
            .group(startValueGroup)
            .transitionDuration(1500)
            .centerBar(true)   
            .gap(17)
            .x(d3.scale.linear().domain([10, 100]))
            .elasticY(true)
            .on("filtered", function (chart) {
                dc.events.trigger(function () {
                    if(chart.filter()) {
                        console.log(chart.filter());
                        lineChart.filter(chart.filter());
                        }
                    else
                    {lineChart.filterAll()}
                });
            })
            .xAxis().tickFormat(function(v) {return v;});

dataTable.width(800).height(800)
    .dimension(businessDimension)
    .group(function(d) { return "List of all Train Info"
     })
    .size(10000)
    .columns([
        function(d) { return d.Route; },
        function(d) { return d.TripStatus; },
        function(d) { return d.tTrip; },
        function(d) { return d.iPassenger; }
    ])
    .sortBy(function(d){ return d.Route; })
    .order(d3.ascending);			

			
	dc.renderAll();
});
