app.controller('holdingsCtrl', function($scope, $rootScope) {

    console.log("holdings controller");
    $rootScope.currentPage = "Holdings";
    socket.emit("get holdings", true);

    socket.on('holdings', function(data) {
        console.log("socket io holdings update", data);

        $scope.holdings = data;
        drawDonut($scope.holdings);

        $scope.$apply();
    });

    var proportions = [
    	{name: "one", bookValue: 300},
	    {name: "two", bookValue: 230},
	    {name: "three", bookValue: 600}
    ];

    drawDonut(proportions);

    function drawDonut(data) {

    	$(".holdings-donut").html("");

		var width = 960,
		    height = 400,
		    radius = Math.min(width, height) / 2;

		var color = d3.scale.ordinal()
		    .range(["#f2c800", "#8c0000", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

		var arc = d3.svg.arc()
		    .outerRadius(radius - 10)
		    .innerRadius(radius - 70);

		var pie = d3.layout.pie()
		    .sort(null)
		    .value(function(d) { return d.bookValue; });

		var svg = d3.select(".holdings-donut").append("svg")
		    .attr("width", width)
		    .attr("height", height)
		  .append("g")
		    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


		  var g = svg.selectAll(".arc")
		      .data(pie(data))
		    .enter().append("g")
		      .attr("class", "arc");

		  g.append("path")
		      .attr("d", arc)
		      .style("fill", function(d) { return color(d.data.name); });

		  g.append("text")
		      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
		      .attr("dy", ".35em")
		      .text(function(d) { return d.data.name; });

    }

});