var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');

var tripRouter = express.Router();

tripRouter.get('/', function(req, res, next) {
  //res.render('pages/home', { title: 'Tuscany' });
  res.send("Hello from trips");
});

module.exports = tripRouter;