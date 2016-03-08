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
 	//console.log($scope);
 	var autocomplete = new google.maps.places.Autocomplete(input);
	$scope.title = "Create Trip";

	$scope.saveTrip = function(){
		$scope.trip.destination = autocomplete.getPlace();
		$http.post('/trips/create', $scope.trip, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		})
		.error(function(error){
			$scope.error = error;
		})
		.success(function(data){
			console.log(data);
			$state.go('home');
		});
	};
}]);