var mongoose = require('mongoose');

var TripLegSchema = new mongoose.Schema({
	name: String,
	start_date: Date,
	end_date: Date,
	destination: String,
	transportation: String,
	accomodation_addr: String
	// TODO uncomment when you narrow down google autocomplete and can determine what type of address got selected
	//accomodation_type: String,
});

TripLegSchema.methods.validateLeg = function(trip_start_date, trip_end_date){
	// console.log("Validating trip.");
	// console.log("Trip start: " + trip_start_date);
	// console.log("Trip end: " + trip_end_date);
	// console.log(this);
	if(!this.destination){
		return {valid: false, err: 'You need to pick a valid destination for \"' + this.name + "\"."};
	}

	if(this.end_date < this.start_date){
		return {valid: false, err: 'Your end date must be after or the same as the start date for leg \"' + this.name + "\"."};
	}

	if(this.start_date < trip_start_date || this.start_date > trip_end_date
		|| this.end_date < trip_start_date || this.end_date > trip_end_date){
		return {valid: false, err: 'Leg \"' + this.name + '\" must be during the trip.'};
	}
	return {valid: true};
};

mongoose.model('TripLeg', TripLegSchema);