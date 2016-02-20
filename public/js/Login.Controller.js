var loginController = angular.module('loginController', []);

loginController.controller('LoginCtrl', [
	'$scope',
function(
	$scope
){
	$scope.title = "Sign In";
}]);