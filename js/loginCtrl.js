app.controller('loginCtrl', function($scope, $rootScope, $http) {
    $rootScope.currentPage = "Login";

    $scope.loginDetails = {
    	username: "",
		password: ""
    }

    $scope.loginWithPass = function() {
        console.log("loginWithPass", $scope.loginDetails);

	    $http({
	      method: 'POST',
	      url: '/api/login',
	      data: $scope.loginDetails
	    }).then(function successCallback(response) {
	        console.log("got login response", response);


	      }, function errorCallback(response) { console.log("error", response); });

    }

});
