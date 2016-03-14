var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var Trip = mongoose.model('Trip');
var User = mongoose.model('User');

var tripRouter = express.Router();

tripRouter.get('/', function(req, res, next) {
	var user = User.findOne({email: req.payload.email}, function(err, user){
		if(err){ return next(err); }
		Trip.find({'_id': {$in: user.trips}}, function(err, trips){
			res.json(trips);
		})
	});
});

tripRouter.get('/:trip', function(req, res, next){
	req.trip.populate('legs', function(err, trip){
		if(err){ return next(err); }
		res.json(trip);
	});
})

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

	var trip = new Trip();
	trip.start_date = start_date;
	trip.end_date = end_date;
	trip.name = req.body.name;
	trip.destination = req.body.destination.formatted_address;

	trip.save(function(err, trip){
		var user = User.findOne({email: req.payload.email}, function(err, user){
			if(err){ return next(err); }

			user.trips.push(trip);
			user.save(function(err){
				if(err){ return next(err); }
				res.json(req.trip);
			});
		});		
	});
});

tripRouter.param('trip', function(req, res, next, id){
	var query = Trip.findById(id);

	query.exec(function(err, trip){
		if(err){ return next(err); }
		if(!trip){ return next(new Error('No trip found for id ' + id)); }

		req.trip = trip;
		return next();
	})
})

tripRouter.post('/:trip/delete', function(req, res, next){
	User.findOne({email: req.payload.email}, function(err, user){
		if(err){ return next(err); }

		var tripToDelete = user.trips.indexOf(req.trip._id);
		user.trips.splice(tripToDelete, 1);
		user.save(function(err){
			if(err){ return next(err); }
			req.trip.remove(function(err, trip){
				if(err){ return next(err); }
				res.json(trip);
			});	
		});
	});
});

module.exports = tripRouter;