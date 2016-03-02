var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var Trip = mongoose.model('Trip');

var tripRouter = express.Router();

tripRouter.get('/', function(req, res, next) {
	Trip.find(function(err, trips){
		if(err){ return next(err); }
		res.json(trips);
	});
});

module.exports = tripRouter;