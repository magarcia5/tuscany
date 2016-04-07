var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var Trip = mongoose.model('Trip');
var TripLeg = mongoose.model('TripLeg');
var User = mongoose.model('User');

var tripRouter = express.Router();

var construct_document = function(trip, is_leg){
	var start_date = new Date(trip.start_date),
		end_date = new Date(trip.end_date),
		trip_doc;

	if(trip.same_day){
		end_date = start_date;
	}

	if(is_leg){
		trip_doc = new TripLeg();
	}
	else{
		trip_doc = new Trip();
	}

	trip_doc.start_date = trip.start_date;
	trip_doc.end_date = trip.end_date;
	trip_doc.name = trip.name;
	trip_doc.destination = {formatted_address: trip.destination.formatted_address};
	trip_doc.transportation = trip.transportation;
	trip_doc.accomodation_addr = {formatted_address: trip.accomAddr.formatted_address};

	return trip_doc;
};

var get_error_message = function(err){
	var message = "";
	for(field in err.errors){
		message = message.concat(err.errors[field].message + "\n");
	}
	return message;
}

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
	var trip = construct_document(req.body, false),
		trip_start_date = trip.start_date,
		trip_end_date = trip.end_date,
		legs = req.body.legs;

	if(!trip.valid_dates(req.body.same_day)){
		return res.status(400).json({message: 'Check your trip dates.'})
	}

	for(var i = 0; i < legs.length; i++){
		var trip_leg = construct_document(legs[i], true);
		if(!trip_leg.valid_dates(legs[i].same_day, trip_start_date, trip_end_date)){
			return res.status(400).json({message: "Check your leg dates. They need to be within the trip time period."});
		}
		else {
			trip.legs.push(trip_leg);
		}
	}

	trip.save(function(err, trip){
		if(err){ 
			if(err.code === 11000){
				return res.status(400).json({message: "Trip with that name already exists!"});
			}
			// TODO update to log to logger
			if(err.name === 'ValidationError'){
				message = get_error_message(err);
				return res.status(400).json({message: message});
			}
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