app.controller('holdingsCtrl', function($scope, $rootScope) {
    $rootScope.currentPage = "Holdings";

    socket.emit("get holdings", true);

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

	//var middleText = svg.append()

	var path = svg.datum(data).selectAll("path")
	  	.data(pie)
	.enter().append("path")
	  	.attr("fill", function(d, i) { return color(i); })
	  	.attr("d", arc)
	  	.on("mouseover", function(d) {
	  		console.log("mouse over", d.data.name)
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

        $scope.holdings = data;

        change(data);

        $scope.$apply();
    });


});