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
            .when('/login', { templateUrl: 'templates/login.html' }) /* controller is globally scoped in html */
            .otherwise({ redirectTo: '/' });
    }]);




app.controller('homeCtrl', function($scope, $rootScope) {
    $rootScope.currentPage = "Home";
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


    $scope.showSellForm = false;
    $scope.sellStock = function(stock) {
        console.log("sell stock", stock);
        $scope.selectedStock = stock;
        $scope.showSellForm = true;
    }

    $scope.confirmSellStock= function(stock, transaction) {
        $scope.transaction.sold = $scope.transaction.value;
        console.log("confirm sell stock", stock, transaction);
        $scope.transactionExecuted = true;
    }

    $scope.cancelSellStock = function() {
        console.log("confirm buy stock");

        $scope.showSellForm = false;
        $scope.transactionExecuted = false;
        clearInterval(getStockUpdates);
        clearTransactionData();
    }





    $scope.twoDecimalPlaces = function(val) {
      return numeral(val).format('0,0.00')
    }

    socket.emit('get valuation', getUrlVars()["sedol"]);

    // get stocks information
    socket.on('stocks', function(data) {
        console.log("socket io stocks update", data);
        $scope.stocks = data;
        $scope.$apply();
    });
    $http({
        method: 'GET',
        url: '/api/stocks'
    }).then(function successCallback(response) {
    
        console.log("got stocks details", response);
        
        $scope.stocks = response.data;

    }, function errorCallback(response) { console.log("error", response); });




    $scope.stockPrice = "loading...";


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


    // get stock information
    socket.on('stock', function(data) {
        console.log("socket io stock stock stock update", data);
        if(!data || !data.name) return;
        $rootScope.currentPage = data.name;
        $scope.stockPrice = numeral(data.price).format('0.00');
    });
    $http({
        method: 'GET',
        url: '/api/stock?sedol=' + getUrlVars()["sedol"]
    }).then(function successCallback(response) {
    
        $rootScope.currentPage = response.data.name;
        console.log("got stocks details", response);
        
        $scope.stockPrice = numeral(response.data.price).format('0.00');

    }, function errorCallback(response) { console.log("error", response); });





    // WATCHERS

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