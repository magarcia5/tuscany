var app = angular.module('tuscany', [
	'ui.router',
	'homeController',
	'authController',
	'tripController',
	'editTripController',
	'ngAnimate'
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
			url: '/trips/{id}/edit',
			templateUrl: 'views/pages/editTrip.html',
			controller: 'EditTripCtrl',
			resolve: {
				tripToEdit: ['$stateParams', 'trip', function($stateParams, trip){
					return trip.get($stateParams.id);
				}]
			}
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

	auth.getToken = function(){
		return $window.localStorage['tuscany-token'];
	};

	auth.header = {Authorization: 'Bearer ' + auth.getToken()};

	auth.saveToken = function(token){
		$window.localStorage['tuscany-token'] = token;
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
