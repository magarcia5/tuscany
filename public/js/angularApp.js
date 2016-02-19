var app = angular.module('tuscany', [
	'ui.router',
	'homeController'
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
		});
	$urlRouterProvider.otherwise('home');
}]);