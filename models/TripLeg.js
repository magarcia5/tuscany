var mongoose = require('mongoose');

var TripLegSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'You need to name your trip leg']
	},
	start_date: { 
		type: Date,
		required: [true, 'You leg needs a start date']
	},
	end_date: Date,
	destination: {
		type: mongoose.Schema.Types.Mixed,
		validate: {
			validator: function(v){
				valid = v.formatted_address ? true : false;
				return valid;
			},
			message: 'You need to pick a valid google destination.'
		}
	},
	transportation: {
		type: String,
		required: [true, 'You need to pick a method of transportation for your leg.'],
		enum: ['walk', 'drive', 'fly', 'car', 'bike']
	},
	accomodation_addr: {
		type: String,
		validate: {
			validator: function(v){
				valid = v.formatted_address ? true : false;
				return valid;
			},
			message: 'Your accomodations need to be a valid google address.'
		}
	}
	// TODO uncomment when you narrow down google autocomplete and can determine what type of address got selected
	//accomodation_type: String,
});

TripLegSchema.methods.valid_dates = function(same_day, trip_start_date, trip_end_date){
	if(!same_day && !trip.end_date){
		return false;
	}

	if(this.end_date < this.start_date){
		return false;
	}

	if(this.start_date < trip_start_date || this.start_date > trip_end_date
		|| this.end_date < trip_start_date || this.end_date > trip_end_date){
		return false;
	}
	return true;
};

mongoose.model('TripLeg', TripLegSchema);