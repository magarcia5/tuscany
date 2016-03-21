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
	// TODO create factory to handle this if this becomes a regular thing
	var tripDesInput = angular.element(document.querySelector("#trip-dest-auto-complete"))[0],
		tripAccomInput = angular.element(document.querySelector("#trip-accom-auto-complete"))[0],
		legDestInput = angular.element(document.querySelector("#leg-dest-auto-complete"))[0],
		legAccomInput = angular.element(document.querySelector("#leg-accom-auto-complete"))[0],

		tripDestAutoComplete = new google.maps.places.Autocomplete(tripDesInput),
		tripAccomAutoComplete = new google.maps.places.Autocomplete(tripAccomInput),
	  	// TODO narrow this one by destination in first autocomplete 
	  	// TODO narrow by place
  		legDestAutoComplete = new google.maps.places.Autocomplete(legDestInput),
  		legAccomAutoComplete = new google.maps.places.Autocomplete(legAccomInput);

	$scope.title = "Create Trip";
	$scope.trip = {};
	$scope.leg = {};
	$scope.disableCreate = false;
	$scope.showLegForm = false;

	$scope.saveTrip = function(){
		$scope.trip.destination = tripDestAutoComplete.getPlace();
		$scope.trip.accomAddr = tripAccomAutoComplete.getPlace();

		// TODO move this to trip factory. controllers shouldnt directly call the rest handler
		$http.post('/trips/create', $scope.trip, { headers: auth.header })
		.error(function(error){
			$scope.error = error;
		})
		.success(function(data){
			console.log('Going home');
			$state.go('home');
		});
	};

	$scope.showLeg = function(){
		$scope.showLegForm = true;
		$scope.disableCreate = true;	
	};

	$scope.cancelLeg = function(){
		$scope.showLegForm = false;
		$scope.disableCreate = false;
		$scope.leg = {};
	};

	$scope.saveLeg = function(){
		console.log($scope.leg);
		$scope.disableCreate = false;
		$scope.showLegForm = false;
		$scope.legSuccess = {message: 'Leg saved!'};
	}

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
	$scope.updatedTrip.same_day = d1.getTime() === d2.getTime();

	var input = angular.element(document.querySelector("#edit-auto-complete"))[0];
	var autocomplete = new google.maps.places.Autocomplete(input);

	$scope.cancelUpdate = function(){
		$state.go('home');
	}

	$scope.updateTrip = function(){
		trip.updateTrip($scope.tripToEdit._id, $scope.updatedTrip)
		.error(function(err){
			$scope.error = err;
		})
		.success(function(data){
			$state.go('home');
		});
	}
}]);