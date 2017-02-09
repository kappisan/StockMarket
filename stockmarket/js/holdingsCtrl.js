app.controller('holdingsCtrl', function($scope, $rootScope, $http) {
    $rootScope.currentPage = "Holdings";
    $scope.totalReturn = 0;

    function getHoldings() {

	    $http({
	        method: 'POST',
	        url: '/api/holdings',
	        data: {
	        	username: $rootScope.user.username,
	        	uuid: $rootScope.user.uuid
	        }
	    }).then(function successCallback(response) {
	    
	    	var data = response.data;

	        console.log("got holdings details", response);


	        $scope.holdings = _.clone(data.holdings);

	        data.holdings.unshift({name: "cash", bookValue: $rootScope.user.cash})

	        change(data.holdings);

	        var totalValues = _.map($scope.holdings, function(holding) {
	        	return holding.bookValue;
	        });

	        var totalCosts = _.map($scope.holdings, function(holding) {
	        	return holding.bookCost;
	        });

	        var totalValue = data.cash;
			var totalCost = 0;
	        var totalReturn = 0;

	        totalValues.forEach(function(val) {
	        	totalValue+= val;
	        })

	        totalCosts.forEach(function(val) {
	        	totalCost+= val;
	        })

	        $rootScope.user.balance = totalValue;
	        $scope.totalReturn = totalValue - totalCost;
	        $scope.totalCost = totalCost;

	    }, function errorCallback(response) { console.log("error", response); });

    }

    setInterval(getHoldings(), 3000);








    /* donut chart */

    var data = [
    	{name: "one", bookValue: 300},
	    {name: "two", bookValue: 230},
	    {name: "two", bookValue: 230},
	    {name: "two", bookValue: 230},
	    {name: "two", bookValue: 230},
	    {name: "two", bookValue: 230},
	    {name: "two", bookValue: 230},
	    {name: "two", bookValue: 230},
	    {name: "two", bookValue: 230},
	    {name: "two", bookValue: 230},
	    {name: "two", bookValue: 230},
	    {name: "two", bookValue: 230},
	    {name: "two", bookValue: 230},
	    {name: "two", bookValue: 230},
	    {name: "two", bookValue: 230},
	    {name: "two", bookValue: 230},
	    {name: "two", bookValue: 230},
	    {name: "two", bookValue: 230},
	    {name: "two", bookValue: 230},
	    {name: "two", bookValue: 230},
	    {name: "two", bookValue: 230}
    ];

	var width = 960,
	    height = 500,
	    radius = Math.min(width, height) / 2;

	var color = d3.scale.category20();

	var pie = d3.layout.pie()
	    .value(function(d) { return d.bookValue; })
	    .sort(null);

	var arc = d3.svg.arc()
	    .innerRadius(radius - 100)
	    .outerRadius(radius - 20);

	var svg = d3.select(".holdings-donut").append("svg")
	    	.attr("width", width)
	    	.attr("height", height)
	  	.append("g")
	    	.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	var middleText = svg.append("text")
						.attr('class', 'pie-segment')
						.attr("visibility", "hidden")
						.text("Something")

	var valueText = svg.append("text")
						.attr('class', 'pie-segment')
						.attr("visibility", "hidden")
						.attr("transform", "translate(0, 40)")
						.text("Something")

	$scope.mouseOverSegment = function mouseOverSegment(d, i) {
		d3.selectAll(".donut-segment").attr("opacity", "0.2")
		d3.selectAll(".donut-segment-"+i).attr("opacity", "1").attr("stroke", "#f2c800").attr("stroke-width", "8px");
  		console.log("mouse over", d.name)
  		middleText.attr("visibility", "visible").text(d.name);
  		valueText.attr("visibility", "visible").text(numeral(d.bookValue).format('0,0.00'));
	}

	$scope.mouseOutSegment = function mouseOutSegment() {
		d3.selectAll(".donut-segment").attr("opacity", "1").attr("stroke-width", "0");			
  		middleText.attr("visibility", "hidden");
  		valueText.attr("visibility", "hidden");
	}

	var path = svg.datum(data).selectAll("path")
	  	.data(pie)
	.enter().append("path")
	  	.attr("fill", function(d, i) { return color(i); })
	  	.attr("d", arc)
	  	.attr("class", function(d,i) {
	  		return "donut-segment donut-segment-" + i;
	  	})
	  	.on("mouseover", function(d, i) {
	  		$scope.mouseOverSegment(d.data, i);
	  	})
	  	.on("mouseout", function(d) {
	  		$scope.mouseOutSegment();
	  	})
	  	.each(function(d) { this._current = d; }); // store the initial angles


	function change(data) {

		console.log("pie change", data);

		svg.datum(data).selectAll("path").data(pie).enter();
		svg.datum(data).selectAll("path").data(pie).exit().remove();

		pie.value(function(d) { return d.bookValue; }); // change the value function
		path = path.data(pie); // compute the new angles
		path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
	}


	function arcTween(a) {
	  	var i = d3.interpolate(this._current, a);
	  	this._current = i(0);
	  	return function(t) { return arc(i(t)); };
	}

});