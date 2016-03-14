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
		// TODO move this to trip factory. controllers shouldnt directly call the rest handler
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
	'$state',
	'trip',
function(
	$scope,
	tripToEdit,
	auth,
	$state,
	trip
){
	$scope.tripToEdit = tripToEdit;
	$scope.updatedTrip = {};

	$scope.editName = false;
	$scope.editStartDate = false;
	$scope.editEndDate = false;
	$scope.editDestination = false;

	var d1 = new Date($scope.tripToEdit.start_date);
	var d2 = new Date($scope.tripToEdit.end_date);
	$scope.sameDay = d1.getTime() === d1.getTime();

	var input = angular.element(document.querySelector("#edit-auto-complete"))[0];
	var autocomplete = new google.maps.places.Autocomplete(input);

	$scope.cancelUpdate = function(){
		$state.go('home', {headers : auth.header});
	}

	$scope.updateTrip = function(){
		trip.updateTrip($scope.updatedTrip);
	}
}]);