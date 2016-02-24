var app = angular.module('tuscany', [
	'ui.router',
	'homeController',
	'authController'
]);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
function(
	$stateProvider,
	$urlRouterProvider
){
	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl'
		})
		.state('register', {
			url: '/register',
			templateUrl: 'views/pages/register.html',
			controller: 'AuthCtrl'
		});
	$urlRouterProvider.otherwise('home');
}]);

app.factory('auth', [
	'$http',
	'$window',
function(
	$http,
	$window
){
	var auth = {};

	auth.saveToken = function(token){
		$window.localStorage['tuscany-token'] = token;
	};

	auth.getToken = function(){
		return $window.localStorage['tuscany-token'];
	};

	auth.isLoggedIn = function(){
		var token = auth.getToken();

		if(token){
			// don't ask
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.exp > Date.now() / 1000;
		} else{
			return false;
		}
	};

	auth.currentUser = function(){
		if(auth.isLoggedIn()){
			var token = auth.getToken();

			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.username;
		}
	};

	auth.register = function(user){
		return $http.post('/register', user).success(function(data){
			auth.saveToken(data.token);
		});
	};

	auth.login = function(user){
		return $http.post('/login', user).success(function(data){
			auth.saveToken(data.token);
		});
	};

	auth.logout = function(){
		$window.localStorage.removeItem('tuscany-token');
	};

	return auth;
}]);
