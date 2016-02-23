var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/home', { title: 'Tuscany' });
});

router.post('/register', function(req, res, next){
	console.log("post!");
	if(!req.body.username || !req.body.password || !req.body.confirm_psswd){
		return res.status(400).json({message: 'Please fill out all fields'});
	}

	var user = new User();
	user.username = req.body.username;
	user.setPassword(req.body.password)

	user.save(function (err){
		if(err){ 
			console.log("error: " + err);
			return next(err); 
		}
		console.log("User saved");
		return res.json({token: user.generateJWT()})
	});
});

module.exports = router;
