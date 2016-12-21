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
    socket.emit("get stocks", true);


    $rootScope.currentPage = "Market";


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



app.controller('mainCtrl', function($scope, $rootScope, $location, $http) {

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
    }

    $scope.goToMarketPage = function() {
      $rootScope.currentPage = "Market";
    }

    $scope.goToHoldingsPage = function() {
      $rootScope.currentPage = "Holdings";
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

    socket.emit('get valuation', getUrlVars()["sedol"]);

    socket.on('stocks', function(data) {
        console.log("socket io stocks update", data);
        $scope.stocks = data;
        $scope.$apply();
    });

    socket.on('connect', function(data) {
        socket.emit('join', 'Hello World from client');
    });

    $scope.stockPrice = "loading...";

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

    socket.on('stock', function(data) {
        console.log("socket io stock stock stock update", data);
        if(!data || !data.name) return;
        $rootScope.currentPage = data.name;
        $scope.stockPrice = numeral(data.price).format('0.00');
    });



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