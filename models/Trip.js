var mongoose = require('mongoose');
var TripLeg = mongoose.model('TripLeg').schema;

var TripSchema = new mongoose.Schema({
	name: { 
		type: String, 
		required: [ true, 'You must name the trip' ] 
	},
	start_date: { 
		type: Date, 
		required: [ true, 'Your trip needs a start date' ] 
	},
	end_date: { type: Date },
	destination: { 
		type: mongoose.Schema.Types.Mixed, 
		required: [ true, 'You trip needs a destination' ],
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
		enum: ['car', 'plane', 'train', 'walk', 'bike' ],
		required: [ true, 'You need to pick a method of transportation. ']
	},
	accomodation_addr: {
		type: mongoose.Schema.Types.Mixed,
		validate: {
			validator: function(v){
				valid = v.formatted_address ? true : false;
				return valid;
			},
			message: 'You need to pick a valid google accomodation address.'
		}
	},
	// TODO uncomment when you narrow down google autocomplete and can determine what type of address got selected
	//accomodation_type: String,
	legs: [TripLeg]
});

TripSchema.methods.valid_dates = function(same_day){
	if(!same_day && !this.end_date){
		return false;
	}

	if(this.end_date < this.start_date){
		return false;
	}

	// TODO make sure the date isn't in the past
	return true;
};

mongoose.model('Trip', TripSchema);