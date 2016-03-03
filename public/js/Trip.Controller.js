var tripController = angular.module('tripController', []);

tripController.controller('TripCtrl', [
	'$scope',
	'$http',
function(
	$scope,
	$http
){
	$scope.title = "Create Trip";
}]);