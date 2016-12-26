app.controller('statementsCtrl', function($scope, $rootScope, $http) {

    console.log("statementsCtrl");

    $rootScope.currentPage = "Statements";
    $scope.statements = [];

    $http({
        method: 'POST',
        url: '/api/statements?username=' + getUrlVars()["username"],
        data: {
        	username: $rootScope.user.username
        }
    }).then(function successCallback(response) {
    
        console.log("got statements details", response);
        
    	$scope.statements = response.data;

    }, function errorCallback(response) { console.log("error", response); });

});