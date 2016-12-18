var socket = io.connect('http://localhost:7777');

var app = angular.module('stockApp', ['ngRoute'])
    .config( ['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', { templateUrl: 'templates/home.html', controller: "homeCtrl" })  
            .when('/holdings', { templateUrl: 'templates/holdings.html', controller: "holdingsCtrl" })
            .when('/stock', { templateUrl: 'templates/stock.html', controller: "stockCtrl" })  
            .when('/profile', { templateUrl: 'templates/profile.html', controller: "profileCtrl" })
            .when('/market', { templateUrl: 'templates/market.html', controller: "marketCtrl" })
            .when('/statements', { templateUrl: 'templates/statements.html', controller: "statementsCtrl" })
            .otherwise({ redirectTo: '/' });
    }]);


app.controller('homeCtrl', function($scope) {

});


app.controller('holdingsCtrl', function($scope) {

    console.log("holdings controller");

    socket.emit("get holdings", true);

    socket.on('holdings', function(data) {
        console.log("socket io holdings update", data);

        $scope.holdings = data;
        $scope.$apply();
    });

});


app.controller('marketCtrl', function($scope, $http) {

    console.log("market controller");

    $http({
      method: 'GET',
      url: '/api/stocks'
    }).then(function successCallback(response) {
        console.log("got stocks", response);

        $scope.stocks = response.data;

      }, function errorCallback(response) {
        console.log("error", response);
      });

});

app.controller('statementsCtrl', function($scope, $http) {

    console.log("statementsCtrl");

    $http({
      method: 'POST',
      url: '/api/transactions'
    }).then(function successCallback(response) {
        console.log("got transactions", response);

        $scope.stocks = response.data;

      }, function errorCallback(response) {
        console.log("error", response);
      });

});

app.controller('profileCtrl', function($scope) {

    console.log("profile controller");

});

app.controller('stockCtrl', function($scope) {
    $scope.company = {};

    $scope.company.kappisan = generateData();

    console.log("angular loaded", $scope.company);

    drawLineChart($scope.company.kappisan);

    function drawLineChart(data) {

      // Set the dimensions of the canvas / graph
      var margin = {top: 30, right: 20, bottom: 30, left: 50},
          width = 600 - margin.left - margin.right,
          height = 270 - margin.top - margin.bottom;

      // Parse the date / time
      var parseDate = d3.time.format("%d-%b-%y").parse;

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
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.close); });
          
      // Adds the svg canvas
      var svg = d3.select(".line-svg")
          .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
          .append("g")
              .attr("transform", 
                    "translate(" + margin.left + "," + margin.top + ")");

      data.forEach(function(d) {
          d.date = parseDate(d.date);
      });

      // Scale the range of the data
      x.domain(d3.extent(data, function(d) { return d.date; }));
      y.domain(d3.extent(data, function(d) { return d.close; }));

      // Add the valueline path.
      svg.append("path")
          .attr("class", "line")
          .attr("d", valueline(data));

      // Add the X Axis
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      // Add the Y Axis
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);
    }

    function generateData() {
        var data = [];

        var price = (Math.random() * 10) + 4;
        var multiplier = Math.random() - 0.5;
        var startDate = moment("01-Jan-14", "DD-MMM-YY");

        for(var i = 0; i < 100; i++) {

            if(i % 4 == 0) { multiplier = Math.random() - 0.5; }

            price += (Math.random() * multiplier);
            var date = startDate.add(1, "days")

            data.push({date: date.format("DD-MMM-YY"), close: price});        
        }

        return data;
    }

});



app.controller('mainCtrl', function($scope, $location) {

    $scope.transaction = {
      volume: 0
    }

    $scope.selectedStock = {name: ""}

    $scope.goToStock = function(sedol) {
      console.log("goToStock", sedol);
      $location.url('stock?sedol=' + sedol);
    }

    $scope.showTransactionForm = false;
    $(".transactionForm").css("visibility", "visible");
    $scope.buyStock = function(stock) {
        console.log("buy stock", stock);
        $scope.selectedStock = stock;
        $scope.showTransactionForm = true;
    }

    $scope.confirmBuyStock = function(stock) {
        console.log("confirm buy stock", stock);
    }

    $scope.cancelBuyStock = function() {
        console.log("confirm buy stock");

        $scope.showTransactionForm = false;
    }


    socket.on('connect', function(data) {
        socket.emit('join', 'Hello World from client');
    });

    $scope.stockPrice = "loading...";

    socket.on('price', function(data) {
        console.log("socket io price update", data);
        $scope.stockPrice = numeral(data).format('0.00');
        $scope.$apply();

    });


    $scope.user = {
      username: "Kasper Wilkosz",
      balance: numeral(59342).format('0,0.00'),
      holdings: []
    }

    $scope.info = {
      name: "kappisan",
      shares: 2000000,
      volumeAverage: 3000,
      pe: 50.8,
      divYield: 1.2
    }

});
