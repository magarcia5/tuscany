angular.module('tuscany').factory('trip', [
	'$http',
	'auth',
function(
	$http,
	auth
){
	var trip = {};

	trip.getTrips = function(){
		return $http.get('/trips', {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		}).then(function(res){
			console.log(res.data);
			return res.data;
		});	
	};

	return trip;
}]);