var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var Trip = mongoose.model('Trip');
var TripLeg = mongoose.model('TripLeg');
var User = mongoose.model('User');

var tripRouter = express.Router();

var construct_trip = function(trip){
	var start_date = new Date(trip.start_date);
	var end_date = new Date(trip.end_date);

	if(trip.same_day){
		end_date = start_date;
	}

	var trip_doc = new Trip();
	trip_doc.start_date = trip.start_date;
	trip_doc.end_date = trip.end_date;
	trip_doc.name = trip.name;
	trip_doc.destination = {"formatted_address": trip.destination.formatted_address};
	trip_doc.transportation = trip.transportation;
	trip_doc.accomodation_addr = trip.accomAddr ? trip.accomAddr.formatted_address : "";

	var info = trip_doc.validateTrip();

	return {trip_doc: trip_doc, info: info}; 
};

var construct_leg = function(leg, trip_start_date, trip_end_date){
	var start_date = new Date(leg.start_date);
	var end_date = new Date(leg.end_date);

	if(leg.same_day){
		end_date = start_date;
	}

	var leg_doc = new TripLeg();
	leg_doc.start_date = start_date;
	leg_doc.end_date = end_date;
	leg_doc.name = leg.name;
	leg_doc.destination = {"formatted_address": leg.destination.formatted_address};
	leg_doc.transportation = leg.transportation;
	leg_doc.accomodation_addr = leg.accomAddr ? leg.accomAddr.formatted_address : "";

	var info = leg_doc.validateLeg(trip_start_date, trip_end_date);

	return {leg_doc: leg_doc, info: info}; 
};

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
	var trip = construct_trip(req.body),
		trip_doc = trip.trip_doc,
		info = trip.info,
		trip_start_date = trip_doc.start_date,
		trip_end_date = trip_doc.end_date,
		legs = req.body.legs;

	for(var i = 0; i < legs.length; i++){
		var trip_leg = construct_leg(legs[i], trip_start_date, trip_end_date),
			trip_leg_doc = trip_leg.leg_doc,
			leg_info = trip_leg.info;

		if(!leg_info.valid){
			return res.status(400).json({message: leg_info.err})
		}
		else {
			trip_doc.legs.push(trip_leg_doc);
		}
	}

	if(!info.valid){
		return res.status(400).json({message: info.err});
	}	
	trip_doc.save(function(err, trip){
		if(err){ 
			if(err.code === 11000){
				return res.status(400).json({message: "Trip with that name already exists!"});
			}
			// TODO update to log to logger
			console.log(err);
			return next(err); 
		}
		var user = User.findOne({email: req.payload.email}, function(err, user){
			if(err){ 
				// TODO update to log this
				return next(err); 
			}

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

tripRouter.put('/:trip/update', function(req, res, next){
	// fixing validation and then ill come back to this
	res.json({message: "update coming soon"});
});

module.exports = tripRouter;