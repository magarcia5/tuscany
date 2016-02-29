var mongoose = require('mongoose');

var TripLegSchema = mongoose.Schema({
	name: {type: String, lowercase: true, unique: true},
	// I'm guessing this will be a google url when integrated with google maps
	destination: String,
	transportation: String, 
	accomodation_type: String, 
	accomodation_address: String,
	start_date: Date,
	end_date: Date
});

mongoose.model('TripLeg', TripLegSchema);