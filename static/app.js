(function ($) {
    $.fn.shake = function (options) {
        // defaults
        var settings = {
            'shakes': 2,
            'distance': 10,
            'duration': 400
        };
        // merge options
        if (options) {
            $.extend(settings, options);
        }
        // make it so
        var pos;
        return this.each(function () {
            $this = $(this);
            // position if necessary
            pos = $this.css('position');
            if (!pos || pos === 'static') {
                $this.css('position', 'relative');
            }
            // shake it
            for (var x = 1; x <= settings.shakes; x++) {
                $this.animate({ left: settings.distance * -1 }, (settings.duration / settings.shakes) / 4)
                    .animate({ left: settings.distance }, (settings.duration / settings.shakes) / 2)
                    .animate({ left: 0 }, (settings.duration / settings.shakes) / 4);
            }
        });
    };
}(jQuery));

$(function(){

	$('#loginBut').click(function(event){
		event.preventDefault();

		$(this).shake();

			
		//post to server
		// $.ajax({
		//    url: 'login',
		//    statusCode: {
		//      404: function(){
		//      	//do not login
		//      	//shake 
		// 		$( "#loginBut" ).animate({
		// 		    width: "toggle",
		// 		    height: "toggle"
		// 		  }, {
		// 		    duration: 5000,
		// 		    specialEasing: {
		// 		      width: "linear",
		// 		      height: "easeOutBounce"
		// 		    },
		// 		    complete: function() {
		// 		      $( this ).after( "<div>Animation complete.</div>" );
		// 		    }
		// 		  });
		//      },
		//      200: function(){
		//      	//login
		//      },
		//      500: function(){
		//      	//error
		//      	alert('server error')
		//      }
		//    }
		// });
	})

	$('.pricing-table-header').click( function(){
		//hide others
		var selected = $(this);

		var type;

		if($(this).parent().hasClass('pricing-table-gold'))
			type = 'gold';
		else if($(this).parent().hasClass('pricing-table-oil'))
			type = 'oil';
		else if($(this).parent().hasClass('pricing-table-usdcad'))
			type = 'usdcad';
		else if($(this).parent().hasClass('pricing-table-tsx'))
			type = 'tsx';
		else if($(this).parent().hasClass('pricing-table-nasdaq'))
			type = 'nasdaq';
		else if($(this).parent().hasClass('pricing-table-dow'))
			type = 'dow';

		console.log(type);


		var graphDiv = $('.l-content').append("<div class='graph'></div>");
		//append svg d3 onto graph div
		addLegend(type)
		addChart('.graph',type);

		var others = $('.pure-u-1-3');

		var chart = $("svg").click(function(){
			//reverse
			chart.fadeOut(function(){
				others.fadeIn();
			});

			$(".graph").remove();
		});

		//fade all other divs
		others.fadeOut(function(){
			chart.fadeIn();
		});


	});

});

function addLegend(type){
	$(".graph").append("<div class='legend'></div>");

	$(".legend").append("<div class ='box'></div> <span class='legendName'></span>");
	$('.legendName').text(type);

}

function formatData(data){

	var result = data.data;

	//precision
	for (var i = result.length - 1; i >= 0; i--) {

		if(result[i].price < 1)
			result[i].price = result[i].price.toFixed(3)
		else if (result[i].price < 10)
			result[i].price = result[i].price.toFixed(2)
		else if (result[i].price < 100)
			result[i].price = result[i].price.toFixed(1)
		else 
			result[i].price = result[i].price.toFixed(0)
	};

	return result;
}

function addChart(jElement,type){

	var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

	var parseDate = d3.time.format("%Y%m%d").parse;

	var x = d3.time.scale()
	    .range([0, width]);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var color = d3.scale.category10();

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var line = d3.svg.line()
	    .interpolate("basis")
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(d.price); });

	var svg = d3.select(jElement).append("svg")
   		.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
 		.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	//hide
	$("svg").hide();

	//request based on type
	d3.json("data/"+type, function(error, data) {

	  data = formatData(data);

	  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

	  data.forEach(function(d) {
	    d.date = parseDate(d.date.toString());
	  });

	  var cities = color.domain().map(function(name) {
	    return {
	      name: name,
	      values: data.map(function(d) {
	        return {date: d.date, price: +d[name]};
	      })
	    };
	  });

	  x.domain(d3.extent(data, function(d) { return d.date; }));

	  y.domain([
	    d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.price; }); }),
	    d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.price; }); })
	  ]);

	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);

	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Price");

	  var city = svg.selectAll(".city")
	      .data(cities)
	    .enter().append("g")
	      .attr("class", "city");

	  city.append("path")
	      .attr("class", "line")
	      .attr("d", function(d) { return line(d.values); })
	      .style("stroke", function(d) { return color(d.name); });

	  city.append("text")
	      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
	      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.price) + ")"; })
	      .attr("x", 3)
	      .attr("dy", ".35em")
	      .text(function(d) { return d.name; });
	});
}