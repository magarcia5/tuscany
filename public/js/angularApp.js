var app = angular.module('tuscany', [
	'ui.router',
	'homeController',
	'authController',
	'tripController'
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
			templateUrl: 'views/pages/home.html',
			controller: 'MainCtrl'
		})
		.state('register', {
			url: '/register',
			templateUrl: 'views/pages/register.html',
			controller: 'AuthCtrl'
		})
		.state('login', {
			url: '/login',
			templateUrl: 'views/pages/login.html',
			controller: 'AuthCtrl'
		})
		.state('createTrip', {
			url: '/trips/create',
			templateUrl: 'views/pages/createTrip.html',
			controller: 'TripCtrl'
		})
		.state('editTrip', {
			url: '/trips/edit',
			templateUrl: 'views/pages/editTrip.html',
			controller: 'TripCtrl'
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
