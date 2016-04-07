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
  		legAccomAutoComplete = new google.maps.places.Autocomplete(legAccomInput),

  		emptyLeg = {
  			'accomAddr': '',
  			'destination': ''
  		};

	$scope.title = "Create Trip";
	// $scope.newTrip = {
	// 	accomAddr: undefined, 
	// 	destination: {
	// 		formatted_address: "San Francisco, CA, USA"
	// 	},
	// 	start_date: new Date("Tue Jan 01 2016 00:00:00 GMT-0800 (PST)"),
	// 	end_date: new Date("Tue Jan 05 2016 00:00:00 GMT-0800 (PST)"),
	// 	name: "Mel's Trip Two Legs, Same Day, 2+ Days",
	// 	transportation: "car",
	// 	legs: []
	// };

	// // TODO figure out why this keeps getting reset when you hit enter when entering destination
	// $scope.newTrip.legs.push({
	// 	accomAddr: undefined, 
	// 	destination: {
	// 		formatted_address: "Santa Monica, CA, USA"
	// 	},
	// 	start_date: new Date("Tue Jan 02 2016 00:00:00 GMT-0800 (PST)"),
	// 	end_date: new Date("Tue Jan 04 2016 00:00:00 GMT-0800 (PST)"),
	// 	name: "Day Trip",
	// 	transportation: "car"
	// });
	$scope.newTrip = {
		accomAddr: '',
		destination: ''
	};
	$scope.newTrip.legs = [];
	$scope.leg = emptyLeg;
	$scope.updating = false;
	$scope.disableCreate = false;
	$scope.showLegForm = false;

	$scope.saveTrip = function(){
		//TODO hide end date if user selects the same day for start and end
		var destination = tripDestAutoComplete.getPlace(),
			accom = tripAccomAutoComplete.getPlace();

		if(destination){
			$scope.newTrip.destination = destination
		}
		if(accom){
			$scope.newTrip.accomAddr = accom;
		}

		trip.createTrip($scope.newTrip)
		.error(function(error){
			$scope.tripError = error;
			$timeout(function(){ $scope.tripError = null; }, 4000);
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
		legDestInput.value = "";
		legAccomInput.value = "";
		$scope.leg = emptyLeg;
	};

	$scope.saveLeg = function(){
		// COMMENTED OUT FOR TESTING PURPOSES ONLY
		var destination = legDestAutoComplete.getPlace();
		var accom = legAccomAutoComplete.getPlace();

		if(destination){
			$scope.leg.destination = destination;
		}
		if(accom){
			$scope.leg.accomAddr = accom;
		}

		$scope.disableCreate = false;
		$scope.showLegForm = false;
		$scope.newTrip.legs.push($scope.leg);
		$scope.leg = emptyLeg;		
		legDestInput.value = "";
		legAccomInput.value = "";
		$scope.successMsg = "Leg added!";
		$timeout(function(){ $scope.successMsg = null; }, 2000);	

	};

	$scope.updateLeg = function(){
		var verifyFields = trip.verifyAllFieldsPresent($scope.leg);
		if(verifyFields.valid){
			var indexOf = $scope.newTrip.legs.indexOf($scope.leg);
			$scope.newTrip.legs[indexOf] = $scope.leg;
			$scope.updating = false;
			$scope.showLegForm = false;
			legDestInput.value = "";
			legAccomInput.value = "";
			$scope.leg = emptyLeg;
			$scope.successMsg = "Leg updated!";
			$timeout(function(){ $scope.successMsg = null; }, 2000);
		}
		else {
			$scope.legError = verifyFields;
			$timeout(function(){ $scope.legError = null; }, 2000);
		}
	}

}]);

var editTripController = angular.module('editTripController', []);

editTripController.controller('EditTripCtrl', [
	'$scope',
	'$state',
	'$timeout',
	'tripToEdit',
	'auth',
	'trip',
function(
	$scope,
	$state,
	$timeout,
	tripToEdit,
	auth,
	trip
){
	$scope.tripToEdit = tripToEdit;
	$scope.tripToEdit.destination = $scope.tripToEdit.destination.formatted_address;
	$scope.tripToEdit.accomAddr = $scope.tripToEdit.accomAddr ? $scope.tripToEdit.accomAddr.formatted_address : "";

	$scope.tripToEdit.start_date = new Date($scope.tripToEdit.start_date);

	if(!$scope.tripToEdit.end_date){
		$scope.tripToEdit.same_day = true;
	}
	else{
		$scope.tripToEdit.end_date = new Date($scope.tripToEdit.end_date);	
	} 

	var destInput = angular.element(document.querySelector("#edit-dest-auto-complete"))[0],
		destAutoComplete = new google.maps.places.Autocomplete(destInput),

		accomInput = angular.element(document.querySelector("#edit-accom-auto-complete"))[0],
		accomAutoComplete = new google.maps.places.Autocomplete(accomInput);

	$scope.cancelUpdate = function(){
		$state.go('home');
	}

	$scope.updateTrip = function(){
		var destination = destAutoComplete.getPlace();
		var accom = accomAutoComplete.getPlace();

		if(destination){
			$scope.tripToEdit.destination = destination;
		}
		if(accom){
			$scope.tripToEdit.accomAddr = accom;
		}

		var verify = trip.verifyAllFieldsPresent($scope.tripToEdit, "edit");
		if(verify.valid){
			console.log("update");
			trip.updateTrip($scope.tripToEdit._id, $scope.tripToEdit)
			.error(function(err){
				$scope.tripError = err;
			})
			.success(function(data){
				$state.go('home');
			});
		}
		else {
			$scope.tripError = verify;
			$timeout(function(){ $scope.tripError = null; }, 4000);
		}
	}
}]);