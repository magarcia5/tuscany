var tripController = angular.module('tripController', []);

tripController.controller('TripCtrl', [
	'$scope',
	'$http',
	'$state',
	'auth',
function(
	$scope,
	$http,
	$state,
	auth
){
	$scope.title = "Create Trip";

	$scope.saveTrip = function(){
		$http.post('/trips/create', $scope.trip, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		}).success(function(data){
			$state.go('home');
		});
	};
}]);