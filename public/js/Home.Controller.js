var homeController = angular.module('homeController', []);

homeController.controller('MainCtrl', [
	'$scope',
function(
	$scope
){
	$scope.title = "Home Page";
}]);