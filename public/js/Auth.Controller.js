var authController = angular.module('authController', []);

authController.controller('AuthCtrl', [
	'$scope',
	'$state',
	'auth',
function(
	$scope,
	$state,
	auth
){
	$scope.user = {};
	$scope.register = function(){
		auth.register($scope.user).error(function(error){
			$scope.error = error;
		}).then(function(){
			console.log("Then..");
			$state.go('/home');
		});
	};
}]);