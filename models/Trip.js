var mongoose = require('mongoose');

var TripSchema = new mongoose.Schema({
	name: {type: String, lowercase: true, unique: true},
	start_date: Date,
	end_date: Date,
	destination: String,
	legs: [{type: mongoose.Schema.Types.ObjectId, ref: 'TripLeg'}]
});

mongoose.model('Trip', TripSchema);