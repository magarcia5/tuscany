angular.module('tuscany').factory('trip', [
	'$http',
	'auth',
function(
	$http,
	auth
){
	var trip = {};
	var REQUIRED_TRIP_FIELDS = ["name", "destination", "start_date", "transportation"];
	// Destination doesnt need to be verified when editing bc the obj from the db isnt a valid google place yet.
	// The controller will make sure it doesn't get updated unless its a valid google place tho.
	var REQUIRED_TRIP_FIELDS_EDIT = ["name", "start_date", "transportation"];
	
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
		var required_fields = [];
		if(mode === "edit"){
			required_fields = REQUIRED_TRIP_FIELDS_EDIT;
		}
		else{
			required_fields = REQUIRED_TRIP_FIELDS;
		}
		for(i = 0; i < required_fields.length; i++){
			if(!(required_fields[i] in trip) || !trip[required_fields[i]]){
				return {valid: false, message: "Oops! You're missing field " + required_fields[i]};
			}
		}
		if (!trip.same_day && !trip.end_date){
			return {valid: false, message: "Oops! You're missing a trip field"};
		}	
		return {valid: true};
	};

	return trip;
}]);
