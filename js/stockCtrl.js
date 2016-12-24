app.controller('stockCtrl', function($scope, $rootScope, $http) {
    

    console.log("angular loaded", $scope.company);

    socket.emit('get valuation', getUrlVars()["sedol"]);
	socket.emit('get stock', getUrlVars()["sedol"]);

    $scope.company = {};

    socket.on('stock', function(data) {
        if(!data || !data.name) return;
        $scope.company = data;
    });

    $http({
        method: 'GET',
        url: '/api/stock?sedol=' + getUrlVars()["sedol"]
    }).then(function successCallback(response) {
    
        console.log("got stocks details for valuations", response.data.valuations);
        
        $scope.valuations = response.data.valuations;

        $(".line-svg").html('');

        drawLineChart($scope.valuations);


    }, function errorCallback(response) { console.log("error", response); });



    setInterval(function() {
    	socket.emit('get valuation', getUrlVars()["sedol"]);
    	socket.emit('get stock', getUrlVars()["sedol"]);
    }, 3000)

    socket.on('valuations', function(data) {

        console.log("socket io valuations update", data);

        $scope.valuations = data;

        $(".line-svg").html('');

        drawLineChart($scope.valuations);
    });


    function drawLineChart(data) {

      // Set the dimensions of the canvas / graph
      var margin = {top: 30, right: 20, bottom: 30, left: 50},
          width = 600 - margin.left - margin.right,
          height = 270 - margin.top - margin.bottom;

      // Parse the date / time
      var parseDate = d3.time.format("%H:%M:%S").parse;

      // Set the ranges
      var x = d3.time.scale().range([0, width]);
      var y = d3.scale.linear().range([height, 0]);

      // Define the axes
      var xAxis = d3.svg.axis().scale(x)
          .orient("bottom").ticks(5);

      var yAxis = d3.svg.axis().scale(y)
          .orient("left").ticks(5);

      // Define the line
      var valueline = d3.svg.line()
          .x(function(d) { return x(parseDate(d.time)); })
          .y(function(d) { return y(d.close); });
          
      // Adds the svg canvas
      var svg = d3.select(".line-svg")
          .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
          .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
              .on('mousemove', function () {
                  var x = d3.mouse(this)[0];  
                  console.log("mouse position", x);   
              });

        if(!data) { return; }

      // Scale the range of the data
      x.domain(d3.extent(data, function(d) { return parseDate(d.time); }));
      y.domain(d3.extent(data, function(d) { return d.close; }));

      // Add the valueline path.
      svg.append("path")
          .attr("class", "line")
          .attr("d", valueline(data));
     
      // Add the X Axis
      svg.append("g")
          .attr("class", "x axis yellow-graph-key")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);
 /*
      // Add the Y Axis
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);
      */
    }

});