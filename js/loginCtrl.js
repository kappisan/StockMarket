app.controller('loginCtrl', function($scope, $rootScope, $http) {
    $rootScope.currentPage = "Login";

    $rootScope.user = {
      name: "",
      username: "loading...",
      balance: 0,
      cash: 0,
      holdings: []
    }


    var cookieUsername = getCookie("login_username");

    if(cookieUsername) {
    	console.log("getCookie", cookieUsername);
    	$rootScope.user.username = cookieUsername;
    }


    $scope.loginDetails = {
    	username: "",
		password: ""
    }

    $scope.logout = function() {
    	console.log("logout!!!!!");
    	delete_cookie("login_username");

	    $rootScope.user = {
	      name: "",
	      username: "",
	      balance: 0,
	      cash: 0,
	      holdings: []
	    }

    }

    $scope.loginWithPass = function() {
        console.log("loginWithPass", $scope.loginDetails);

	    $http({
	      method: 'POST',
	      url: '/api/login',
	      data: $scope.loginDetails
	    }).then(function successCallback(response) {
	        console.log("got login response", response);

	        if(!response.data) return;

	        $rootScope.user.username = response.data.username;

			setLoginCookie(response.data);

			window.location = '#/holdings'; 

	      }, function errorCallback(response) { console.log("error", response); });

    }

});


/* COOKIE */

var delete_cookie = function(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

// to fetch info from a cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

function setLoginCookie(data) {
    var now = new Date();
    var ttl = new Date(now.getFullYear(), now.getMonth()+1, 1);

    document.cookie = "login_username="+data.username+";expires="+ttl.toGMTString()+";";       
}