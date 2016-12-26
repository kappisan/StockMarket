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
