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
	var input = angular.element(document.querySelector("#auto-complete"))[0];

  	var autocomplete = new google.maps.places.Autocomplete(input);

	$scope.title = "Create Trip";

	$scope.saveTrip = function(){
		$scope.trip.destination = autocomplete.getPlace();
		$http.post('/trips/create', $scope.trip, { headers: auth.header })
		.error(function(error){
			$scope.error = error;
		})
		.success(function(data){
			$state.go('home');
		});
	};
}]);

var editTripController = angular.module('editTripController', []);

editTripController.controller('EditTripCtrl', [
	'$scope',
	'tripToEdit',
	'auth',
function(
	$scope,
	tripToEdit,
	auth
){
	$scope.tripToEdit = tripToEdit;
}]);