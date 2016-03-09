var homeController = angular.module('homeController', []);

homeController.controller('MainCtrl', [
	'$scope',
	'auth',
	'$http',
	'$state',
	'trip',
function(
	$scope,
	auth,
	$http,
	$state,
	trip
){
	$scope.title = "Home Page";

	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.currentUser = auth.currentUser;
	$scope.logout = auth.logout;

	if($scope.isLoggedIn()){
		var tripsDef = trip.getTrips();
		tripsDef.then(function(res){
			$scope.trips = res.data;
		});
	}

	$scope.deleteTrip = function(tripToDelete){
		trip.deleteTrip(tripToDelete).success(function(data){
			// automatically update UI
			var index = $scope.trips.indexOf(data._id);
			$scope.trips.splice(index, 1);
		});
	};

	$scope.createTrip = function(){
		$state.go('createTrip', {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		});
	};
}]);