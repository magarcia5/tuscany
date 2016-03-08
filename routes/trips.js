var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var Trip = mongoose.model('Trip');
var User = mongoose.model('User');

var tripRouter = express.Router();

tripRouter.get('/', function(req, res, next) {
	var user = User.findOne({email: req.payload.email}, function(err, user){
		if(err){ return next(err); }
		var trips = [];
		for(i = 0; i < user.trips.length; i++){
			// TODO: get full trip and display name
			trips.push(user.trips[i]);
		}
		res.json(trips);
	});
});

tripRouter.post('/create', function(req, res, next){
	if(!req.body.name || !req.body.destination || !req.body.start_date || 
		(!req.body.same_day && !req.body.end_date)){
		return res.status(400).json({message: 'Please fill out all fields.'});
	}

	var start_date = new Date(req.body.start_date);
	var end_date = new Date(req.body.end_date);

	if(req.body.same_day){
		end_date = start_date;
	}

	if(end_date < start_date){
		return res.status(400).json({message: 'Your end date must be after or the same as the start date.'});
	}

	if(!req.body.destination.geometry){
		return res.status(400).json({message: 'Enter a valid address.'});
	}

	var user = User.findOne({email: req.payload.email}, function(err, user){
		if(err){ return next(err); }

		var trip = new Trip();
		trip.start_date = start_date;
		trip.end_date = end_date;
		trip.name = req.body.name;
		trip.destination = req.body.destination.formatted_address;

		user.trips.push(trip);

		user.save(function(err){
			if(err){ return next(err); }
			res.json(req.trip);
		});
	});
});

module.exports = tripRouter;