app.controller('loginCtrl', function($scope, $rootScope, $http) {
    $rootScope.currentPage = "Login";

    $rootScope.loginError = false;
    $rootScope.loginErrorMessage = "";

    $rootScope.user = {
      name: "",
      username: "",
      balance: 0,
      cash: 0,
      holdings: []
    }

    function getHoldings() {
    	// get holdings
	    $http({
	        method: 'POST',
	        url: '/api/holdings',
	        data: {
	        	username: $rootScope.user.username,
	        	uuid: $rootScope.user.uuid
	        }
	    }).then(function successCallback(response) {
	    
	        var totalValues = _.map(response.data.holdings, function(holding) {
	          return holding.bookValue;
	        });

	        var totalValue = 0;
	        totalValues.forEach(function(val) {
	          totalValue+= val;
	        })

	        //totalValue += response.data.cash;

	        $scope.holdings = response.data.holdings;
	        $rootScope.user.cash = response.data.cash;
	        $rootScope.user.balance = totalValue;

	    }, function errorCallback(response) { console.log("error", response); });

    }


    var cookieUsername = getCookie("login_username");
    $rootScope.loggedIn = false;
    if(cookieUsername) {
    	console.log("getCookie", cookieUsername);
    	$rootScope.user.username = cookieUsername;
    	$rootScope.loggedIn = true;

    	getHoldings();
    }


    $scope.loginDetails = {
    	username: "",
		password: ""
    }

    $scope.logout = function() {
    	console.log("logout!!!!!");
    	delete_cookie("login_username");
    	$rootScope.loggedIn = false;

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

	        if(response.data.status == false) {

	    	    $rootScope.loginError = true;
				$rootScope.loginErrorMessage = "No Such User";

	        	return console.log("no such user");	
	        }

	        $rootScope.user.username = response.data.username;

			setLoginCookie(response.data);

			$rootScope.loggedIn = true;
			$rootScope.currentPage = "Login";

			// hide error message
		    $rootScope.loginError = false;
		    $rootScope.loginErrorMessage = "";

		    getHoldings();

			setTimeout(function() { window.location = '#/holdings' }, 200);

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