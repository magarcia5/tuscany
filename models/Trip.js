var mongoose = require('mongoose');

var TripSchema = new mongoose.Schema({
	name: String,
	start_date: Date,
	end_date: Date,
	destination: String,
	transportation: String,
	accomodation_addr: String,
	// TODO uncomment when you narrow down google autocomplete and can determine what type of address got selected
	//accomodation_type: String,
	legs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Trip'}]
});

TripSchema.methods.validateTrip = function(){

	if(!this.destination){
		return {valid: false, err: 'You need to pick a valid destination.'};
	}
	if(this.end_date < this.start_date){
		return {valid: false, err: 'Your end date must be after or the same as the start date.'};
	}

	// TODO make sure the date isn't in the past
	return {valid: true};
};

TripSchema.methods.validateLeg = function(trip_start_date, trip_end_date){
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

mongoose.model('Trip', TripSchema);