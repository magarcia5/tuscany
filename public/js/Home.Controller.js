var homeController = angular.module('homeController', []);

homeController.controller('MainCtrl', [
	'$scope',
	'auth',
	'$http',
function(
	$scope,
	auth,
	$http
){
	$scope.title = "Home Page";
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.currentUser = auth.currentUser;
	$scope.logout = auth.logout;

	$scope.showTrips = function(){
		return $http.get('/trips', {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		}).then(function(res){
			if(res.data.length === 0){
				$scope.trips = "No trips";
				$scope.noTrips = true;
			}
			else{
				$scope.trips = res.data;
			}
		});
	};
}]);