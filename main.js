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
            .when('/login', { templateUrl: 'templates/login.html', controller: "loginCtrl" })
            .otherwise({ redirectTo: '/' });
    }]);


app.controller('loginCtrl', function($scope, $rootScope) {
    $rootScope.currentPage = "Login";
});


app.controller('homeCtrl', function($scope, $rootScope) {
    $rootScope.currentPage = "Home";
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
          volume: 0,
          value: 0,
          paid: 0
    }

    function clearTransactionData() {

        $scope.transaction = {
              volume: 0,
              value: 0,
              paid: 0
        }

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

    var getStockUpdates;
    $scope.buyStock = function(stock) {
        console.log("buy stock", stock);
        $scope.selectedStock = stock;
        $scope.showTransactionForm = true;
        socket.emit('get stock', stock.sedol);
        getStockUpdates = setInterval(function() { socket.emit('get stock', stock.sedol); }, 3000);
    }

    $scope.sellStock = function(stock) {
        console.log("sell stock", stock);
        $scope.selectedStock = stock;
        $scope.showTransactionForm = true;
    }

    $scope.confirmBuyStock = function(stock) {
        console.log("confirm buy stock", $scope.stockPrice, $scope.selectedStock, $scope.transaction);

        clearInterval(getStockUpdates);

        $scope.transaction.paid = numeral($scope.stockPrice).format('0,0.00');

        $scope.transactionExecuted = true;

        $http({
            method: 'POST',
            url: '/api/buyStock',
            data: {
                transaction: $scope.transaction,
                sedol: $scope.selectedStock.sedol,
                ticker: $scope.selectedStock.ticker,
                name: $scope.selectedStock.name,
                user: $rootScope.user.username
            }
        }).then(function successCallback(response) {
        
            console.log("got user details", response);
            
            $scope.userDetails = response.data;
            $rootScope.currentPage = $scope.userDetails.name;

        }, function errorCallback(response) { console.log("error", response); });

    }

    $scope.cancelBuyStock = function() {
        console.log("confirm buy stock");

        $scope.showTransactionForm = false;
        $scope.transactionExecuted = false;
        clearInterval(getStockUpdates);
        clearTransactionData();
    }

    $scope.twoDecimalPlaces = function(val) {
      return numeral(val).format('0,0.00')
    }

    socket.emit('get valuation', getUrlVars()["sedol"]);

    socket.on('stocks', function(data) {
        console.log("socket io stocks update", data);
        $scope.stocks = data;
        $scope.$apply();
    });


    $scope.stockPrice = "loading...";

    $rootScope.user = {
      name: "Kasper Wilkosz",
      username: "kasper",
      balance: 0,
      cash: 0,
      holdings: []
    }

    socket.on('holdings', function(data) {
        console.log("socket io holdings update", data);


        var totalValues = _.map(data.holdings, function(holding) {
          return holding.bookValue;
        });

        var totalValue = 0;
        totalValues.forEach(function(val) {
          totalValue+= val;
        })

        $rootScope.user.balance = totalValue;
        $rootScope.user.cash = data.cash;

        $scope.$apply();
    });


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