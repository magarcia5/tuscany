angular.module('tuscany').factory('trip', [
	'$http',
	'auth',
function(
	$http,
	auth
){
	var trip = {};

	trip.get = function(id){
		return $http.get('/trips/' + id, { headers: auth.header }).then(function(res){
			return res.data;
		});
	};

	trip.getTrips = function(){
		return $http.get('/trips', { headers: auth.header });
	};

	trip.deleteTrip = function(trip){
		return $http.post('/trips/' + trip._id + '/delete', null, { headers: auth.header });
	};

	trip.updateTrip = function(id, updateObj){
		return $http.put('/trips/' + id + '/update', updateObj, { headers: auth.header });
	};

	trip.prettyDate = function(date){
		var d = new Date(date);
		return d.toDateString();
	};

	trip.createTrip = function(newTrip){
		return $http.post('/trips/create', newTrip, { headers: auth.header });
	};

	return trip;
}]);