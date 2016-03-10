angular.module('tuscany').factory('trip', [
	'$http',
	'auth',
function(
	$http,
	auth
){
	var trip = {};

	trip.get = function(id){
		return $http.get('/trips/' + id, auth.header).then(function(res){
			return res.data;
		});
	};

	trip.getTrips = function(){
		return $http.get('/trips', {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		});
	};

	trip.deleteTrip = function(trip){
		return $http.post('/trips/' + trip._id + '/delete', null, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		});
	};

	return trip;
}]);