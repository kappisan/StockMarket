app.controller('marketCtrl', function($scope, $rootScope, $http) {

    console.log("market controller");

    $rootScope.currentPage = "Market";

    $http({
      method: 'GET',
      url: '/api/funds'
    }).then(function successCallback(response) {
        console.log("got funds", response);

        $scope.funds = response.data;

      }, function errorCallback(response) { console.log("error", response); });

});