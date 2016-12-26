app.controller('holdingsCtrl', function($scope, $rootScope, $http) {
    $rootScope.currentPage = "Holdings";
    $scope.totalReturn = 0;

    $http({
        method: 'POST',
        url: '/api/holdings?username=' + getUrlVars()["username"],
        data: {
        	username: $rootScope.user.username,
        	uuid: $rootScope.user.uuid
        }
    }).then(function successCallback(response) {
    
        console.log("got holdings details", response);
        
        $scope.holdings = response.data.holdings;
        change($scope.holdings);

    }, function errorCallback(response) { console.log("error", response); });

    socket.emit("get holdings", $rootScope.user.username);

    var data = [
    	{name: "one", bookValue: 300},
	    {name: "two", bookValue: 230},
	    {name: "three", bookValue: 600}
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

	var path = svg.datum(data).selectAll("path")
	  	.data(pie)
	.enter().append("path")
	  	.attr("fill", function(d, i) { return color(i); })
	  	.attr("d", arc)
	  	.on("mouseover", function(d) {
	  		console.log("mouse over", d.data.name)
	  		middleText.attr("visibility", "visible").text(d.data.name);
	  		valueText.attr("visibility", "visible").text(numeral(d.data.bookValue).format('0,0.00'));
	  	})
	  	.on("mouseout", function(d) {
	  		middleText.attr("visibility", "hidden");
	  		valueText.attr("visibility", "hidden");
	  	})
	  	.each(function(d) { this._current = d; }); // store the initial angles


	function change(data) {

		console.log("pie change", data);

		svg.datum(data).selectAll("path").data(pie);

		pie.value(function(d) { return d.bookValue; }); // change the value function
		path = path.data(pie); // compute the new angles
		path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
	}


	function arcTween(a) {
	  	var i = d3.interpolate(this._current, a);
	  	this._current = i(0);
	  	return function(t) { return arc(i(t)); };
	}




    socket.on('holdings', function(data) {
        console.log("socket io holdings update", data);

        change(data.holdings);

        $scope.holdings = data.holdings;

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

        $scope.$apply();
    });


});