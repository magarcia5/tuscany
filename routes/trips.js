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
			console.log(user.trips[i]);
		}
		res.json(trips);
	});
});

tripRouter.post('/create', function(req, res, next){
	if(!req.body.name || !req.body.destination || !req.body.start_date || !req.body.end_date){
		return res.status(400).json({message: 'Please fill out all fields.'});
	}
	res.json(req.trip);
});

module.exports = tripRouter;