var mongoose = require('mongoose');
var TripLeg = mongoose.model('TripLeg').schema;

var TripSchema = new mongoose.Schema({
	name: String,
	start_date: Date,
	end_date: Date,
	destination: mongoose.Schema.Types.Mixed,
	transportation: String,
	accomodation_addr: String,
	// TODO uncomment when you narrow down google autocomplete and can determine what type of address got selected
	//accomodation_type: String,
	legs: [TripLeg]
});

TripSchema.methods.validateTrip = function(){

	if(!this.destination.formatted_address){
		return {valid: false, err: 'You need to pick a valid destination.'};
	}
	if(this.end_date < this.start_date){
		return {valid: false, err: 'Your end date must be after or the same as the start date.'};
	}

	// TODO make sure the date isn't in the past
	return {valid: true};
};

mongoose.model('Trip', TripSchema);