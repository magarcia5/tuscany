var tripController = angular.module('tripController', []);

tripController.controller('TripCtrl', [
	'$scope',
	'$http',
	'$state',
	'$timeout',
	'auth',
	'trip',
function(
	$scope,
	$http,
	$state,
	$timeout,
	auth, 
	trip
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
	$scope.newTrip = {};
	$scope.newTrip.legs = [];
	$scope.leg = {};
	$scope.updating = false;
	$scope.disableCreate = false;
	$scope.showLegForm = false;

	$scope.saveTrip = function(){
		$scope.newTrip.destination = tripDestAutoComplete.getPlace();
		$scope.newTrip.accomAddr = tripAccomAutoComplete.getPlace();

		trip.createTrip($scope.newTrip)
		.error(function(error){
			$scope.tripError = error;
			$timeout(function(){ $scope.tripError = null; }, 2000);
		})
		.success(function(data){
			$state.go('home');
		});
	};

	$scope.showLeg = function(){
		$scope.showLegForm = true;
		$scope.disableCreate = true;	
	};

	$scope.editLeg = function(leg){
		$scope.showLegForm = true;
		$scope.updating = true;
		$scope.leg = leg;
	};

	$scope.deleteLeg = function(leg){
		var indexOf = $scope.newTrip.legs.indexOf(leg);
		$scope.newTrip.legs.splice(indexOf, 1);
	};		

	$scope.cancelLeg = function(){
		$scope.showLegForm = false;
		$scope.disableCreate = false;
		$scope.leg = {};
	};

	$scope.saveLeg = function(){
		$scope.disableCreate = false;
		$scope.showLegForm = false;
		$scope.newTrip.legs.push($scope.leg);
		$scope.leg = {};
	};

	$scope.updateLeg = function(){
		var indexOf = $scope.newTrip.legs.indexOf($scope.leg);
		$scope.newTrip.legs[indexOf] = $scope.leg;
		$scope.updating = false;
		$scope.showLegForm = false;
		$scope.leg = {};
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