var mongoose = require('mongoose');

var TripLegSchema = mongoose.Schema({
	name: String,
	// I'm guessing this will be a google url when integrated with google maps
	destination: String,
	transportation: String, 
	accomodation_type: String, 
	accomodation_address: String,
	// dates must be between the start and end date of trip
	start_date: Date,
	end_date: Date
});

mongoose.model('TripLeg', TripLegSchema);