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


app.controller('homeCtrl', function($scope, $rootScope) {
    $rootScope.currentPage = "Home";
});


app.controller('holdingsCtrl', function($scope, $rootScope) {

    console.log("holdings controller");
    $rootScope.currentPage = "Holdings";
    socket.emit("get holdings", true);

    socket.on('holdings', function(data) {
        console.log("socket io holdings update", data);

        $scope.holdings = data;
        $scope.$apply();
    });

});


app.controller('marketCtrl', function($scope, $rootScope, $http) {

    console.log("market controller");


    $rootScope.currentPage = "Market";

    $http({
      method: 'GET',
      url: '/api/stocks'
    }).then(function successCallback(response) {
        console.log("got stocks", response);

        $scope.stocks = response.data;

      }, function errorCallback(response) {
        console.log("error", response);
      });

    $http({
      method: 'GET',
      url: '/api/funds'
    }).then(function successCallback(response) {
        console.log("got funds", response);

        $scope.funds = response.data;

      }, function errorCallback(response) { console.log("error", response); });

});

app.controller('statementsCtrl', function($scope, $rootScope, $http) {

    console.log("statementsCtrl");

    $rootScope.currentPage = "Statements";

    $http({
      method: 'POST',
      url: '/api/transactions'
    }).then(function successCallback(response) {
        console.log("got transactions", response);

        $scope.stocks = response.data;

    }, function errorCallback(response) { console.log("error", response); });

});

app.controller('profileCtrl', function($scope, $http, $rootScope) {

    console.log("profile controller", getUrlVars()["username"]);

    $scope.userDetails = {
      username: "loading",
      name: "loading",
      id: 1,
      netWorth: 0,
      image: './img/me.jpg'
    }

    $http({
        method: 'GET',
        url: '/api/user?username=' + getUrlVars()["username"]
    }).then(function successCallback(response) {
    
        console.log("got user details", response);
        
        $scope.userDetails = response.data;
        $rootScope.currentPage = $scope.userDetails.name;

    }, function errorCallback(response) { console.log("error", response); });

});

app.controller('stockCtrl', function($scope, $rootScope, $http) {
    

    console.log("angular loaded", $scope.company);
    
    $scope.company = {};

    socket.emit('get valuations', 'get');

    $http({
      method: 'GET',
      url: '/api/stock?sedol=' + getUrlVars()["sedol"]
    }).then(function successCallback(response) {
        console.log("got stock", response);

        $scope.company = response.data;

        $rootScope.currentPage = $scope.company.name;

        console.log("stock name", $scope.company.name);

      }, function errorCallback(response) { console.log("error", response); });


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
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
              .on('mousemove', function () {
                  var x = d3.mouse(this)[0];  
                  console.log("mouse position", x);   
              });

        if(!data) { return; }

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
      /*
      // Add the X Axis
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      // Add the Y Axis
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);
      */
    }

});



app.controller('mainCtrl', function($scope, $rootScope, $location) {

    $scope.transaction = {
      volume: 0
    }


    $scope.selectedStock = {name: ""}

    $scope.goToStock = function(stock) {
      console.log("goToStock", stock.sedol);
      $scope.selectedStock = stock;

      $rootScope.currentPage = stock.ticker + " - " + stock.name;
      $location.url('stock?sedol=' + stock.sedol); 
    }

    $scope.goToProfilePage = function(username, name) {
      $rootScope.currentPage = name;
      $location.url('profile?username='+username);
    }

    $scope.goToStatementsPage = function() {
      $rootScope.currentPage = "Statements";
            //$location.url('statements');
    }

    $scope.goToMarketPage = function() {
      $rootScope.currentPage = "Market";
            //$location.url('market');
    }

    $scope.goToHoldingsPage = function() {
      $rootScope.currentPage = "Holdings";
            //$location.url('holdings');
    }

    $scope.showTransactionForm = false;
    $(".transactionForm").css("visibility", "visible");

    $scope.buyStock = function(stock) {
        console.log("buy stock", stock);
        $scope.selectedStock = stock;
        $scope.showTransactionForm = true;
    }

    $scope.sellStock = function(stock) {
        console.log("sell stock", stock);
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

    socket.on('prices', function(data) {
        console.log("socket io pricesssss update", data);
    });

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



    $scope.$watch("transaction.volume", function(n, o) {
        console.log("transaction change", n);
        $scope.transaction.value = n * (+$scope.stockPrice);
    });

    $scope.$watch("stockPrice", function(n, o) {
        console.log("transaction change", n);
        $scope.transaction.value = $scope.transaction.volume * (+$scope.stockPrice);
    });

});

// gets url parameters
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[key] = value;
    });
    return vars;
}