var authController = angular.module('authController', []);

authController.controller('AuthCtrl', [
	'$scope',
	'auth',
function(
	$scope,
	auth
){
	$scope.user = {};
	$scope.register = function(){
		auth.register($scope.user).error(function(error){
			$scope.error = error;
		}).then(function(){
			$state.go('home');
		});
	};
}]);