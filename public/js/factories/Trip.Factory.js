angular.module('tuscany').factory('trip', [
	'$http',
	'auth',
function(
	$http,
	auth
){
	var trip = {};
	var REQUIRED_TRIP_FIELDS = ["name", "destination", "start_date", "transportation"];
	
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

	trip.verifyAllFieldsPresent = function(trip, mode){
		for(i = 0; i < REQUIRED_TRIP_FIELDS.length; i++){
			if(!(REQUIRED_TRIP_FIELDS[i] in trip) || !trip[REQUIRED_TRIP_FIELDS[i]]){
				return {valid: false, message: "Oops! You're missing field " + REQUIRED_TRIP_FIELDS[i]};
			}
		}
		if (!trip.same_day && !trip.end_date){
			return {valid: false, message: "Oops! You're missing a trip field"};
		}	
		return {valid: true};
	};

	return trip;
}]);
