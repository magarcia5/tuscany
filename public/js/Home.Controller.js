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

	$scope.getTrips = trip.getTrips;
	$scope.trips = $scope.getTrips();

	$scope.createTrip = function(){
		$state.go('createTrip', {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		});
	};
}]);